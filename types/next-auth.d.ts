import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
	interface Session {
		spotifyAccessToken?: string;
		user: DefaultSession['user'];
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		spotifyAccessToken?: string;
		spotifyAccessTokenExpires?: number;
		spotifyRefreshToken?: string;
	}
}
