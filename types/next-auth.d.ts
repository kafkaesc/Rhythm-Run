import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
	interface Session {
		spotifyAccessToken?: string;
		stravaAccessToken?: string;
		user: DefaultSession['user'];
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		spotifyAccessToken?: string;
		stravaAccessToken?: string;
	}
}
