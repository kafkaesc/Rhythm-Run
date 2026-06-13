import type { JWT } from 'next-auth/jwt';
import type { NextAuthOptions } from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

async function refreshSpotifyToken(token: JWT): Promise<JWT> {
	const credentials = Buffer.from(
		`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
	).toString('base64');

	const res = await fetch(SPOTIFY_TOKEN_URL, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${credentials}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: token.spotifyRefreshToken ?? '',
		}),
	});

	if (!res.ok) return { ...token, error: 'SpotifyRefreshError' };

	const data = (await res.json()) as {
		access_token: string;
		expires_in: number;
		refresh_token?: string;
	};

	return {
		...token,
		spotifyAccessToken: data.access_token,
		spotifyAccessTokenExpires: Date.now() + data.expires_in * 1000,
		// Spotify occasionally rotates the refresh token
		...(data.refresh_token && { spotifyRefreshToken: data.refresh_token }),
	};
}

/**
 * NextAuth configuration for the [...nextauth] route handler.
 * Defines the supported OAuth providers and forwards each access token into
 * the session under a provider-specific key, e.g., spotifyAccessToken
 */
export const authOptions: NextAuthOptions = {
	providers: [
		SpotifyProvider({
			clientId: process.env.SPOTIFY_CLIENT_ID ?? '',
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? '',
			authorization: {
				params: {
					scope: [
						'playlist-modify-private',
						'playlist-modify-public',
						'playlist-read-private',
						'user-read-private',
						'user-top-read',
					].join(' '),
				},
			},
			// The Spotify token exchange often exceeds the 3500 ms default
			httpOptions: { timeout: 8000 },
		}),
	],
	callbacks: {
		async jwt({ token, account }) {
			// Initial sign-in: store the access token, refresh token, and expiry
			if (account?.provider === 'spotify') {
				return {
					...token,
					spotifyAccessToken: account.access_token,
					spotifyRefreshToken: account.refresh_token,
					spotifyAccessTokenExpires: account.expires_at
						? account.expires_at * 1000
						: Date.now() + 3600 * 1000,
				};
			}

			// Token still valid — return as-is
			if (Date.now() < (token.spotifyAccessTokenExpires ?? 0)) return token;

			// Token expired — refresh it
			return refreshSpotifyToken(token);
		},
		async session({ session, token }) {
			session.spotifyAccessToken = token.spotifyAccessToken;
			return session;
		},
	},
};
