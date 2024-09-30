import { fail, redirect } from '@sveltejs/kit'
import { lucia } from '$lib/lucia'

import type { Actions } from './$types'

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.session) {
			return fail(401)
		}
		await lucia.invalidateSession(event.locals.session.id)
		const sessionCookie = lucia.createBlankSessionCookie()
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		})
		redirect(302, '/')
	}
}
