import { OAuth2RequestError } from 'arctic'
import type { RequestEvent } from '@sveltejs/kit'

import { githubAuth } from '$lib/lucia'
import { setOAuthSession } from '$lib/lucia/setSession'
import { addUserViaOAuth } from '$lib/database/services/auth/addUser'
import { getOAuthUser } from '$lib/database/services/auth/getExistingUser'

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code')
	const state = event.url.searchParams.get('state')

	const storedStateCookie = event.cookies.get('github_oauth_state') ?? null

	if (!code || !state || state !== storedStateCookie) {
		return new Response(null, {
			status: 400
		})
	}

	try {
		const tokens = await githubAuth.validateAuthorizationCode(code)
		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		})
		const githubUser: GitHubUserResult = await githubUserResponse.json()

		// Sign in user if they already exist
		const existingAccount = await getOAuthUser('github', githubUser.id)
		if (existingAccount) {
			return await setOAuthSession(existingAccount.user_id, event)
		}

		// Get user email details to be added to database on user creation
		{
			const githubUserEmails = await fetch('https://api.github.com/user/emails', {
				headers: {
					Authorization: `Bearer ${tokens.accessToken}`
				}
			})
			const githubUserEmailsJson = await githubUserEmails.json()
			githubUser.email = githubUserEmailsJson[0].email
			githubUser.email_verified = githubUserEmailsJson[0].verified
		}

		// Add user to database
		const userId = await addUserViaOAuth({
			provider_id: 'github',
			provider_user_id: githubUser.id,
			username: githubUser.login,
			email: githubUser.email,
			email_verified: githubUser.email_verified,
			avatar_url: githubUser.avatar_url
		})
		return await setOAuthSession(userId, event)
	} catch (e) {
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			})
		}
		return new Response(null, {
			status: 500
		})
	}
}

interface GitHubUserResult {
	id: string
	login: string // username
	email: string
	email_verified: boolean
	avatar_url: string
}
