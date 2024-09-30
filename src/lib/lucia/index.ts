import { Lucia } from 'lucia'
import { dev } from "$app/environment";
import { NodePostgresAdapter } from '@lucia-auth/adapter-postgresql'
import { pool } from '$lib/database/postgres'

const adapter = new NodePostgresAdapter(pool, {
	user: 'auth.users',
	session: 'auth.sessions'
})

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			githubId: attributes.github_id ?? null,
			googleId: attributes.google_id ?? null,
			username: attributes.username
		}
	}
})

// IMPORTANT!
declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia
		DatabaseUserAttributes: {
			github_id?: number
			google_id?: string
			username: string
		}
	}
}

export { github as githubAuth, google as googleAuth } from './authProviders'
