import { GitHub, Google } from 'arctic'

if (
	!process.env.GITHUB_CLIENT_ID ||
	!process.env.GITHUB_CLIENT_SECRET ||
	!process.env.GITHUB_CALLBACK_URI
) {
	throw new Error('MISSING Github_OAuth_API_Credentials')
}
if (
	!process.env.GOOGLE_CLIENT_ID ||
	!process.env.GOOGLE_CLIENT_SECRET ||
	!process.env.GOOGLE_CALLBACK_URI
) {
	throw new Error('MISSING Google_OAuth_API_Credentials')
}

export const github = new GitHub(process.env.GITHUB_CLIENT_ID, process.env.GITHUB_CLIENT_SECRET, {
	redirectURI: process.env.GITHUB_CALLBACK_URI
})

export const google = new Google(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_CALLBACK_URI
)
