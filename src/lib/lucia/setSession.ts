import type { UUID } from 'node:crypto'

import { lucia } from '.'

import type { RequestEvent } from '@sveltejs/kit'

export async function setOAuthSession(userId: UUID, event: RequestEvent) {
	const session = await lucia.createSession(userId, {})
	const sessionCookie = lucia.createSessionCookie(session.id)
	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	})
	return new Response(null, {
		status: 302,
		headers: {
			Location: '/'
		}
	})
}
