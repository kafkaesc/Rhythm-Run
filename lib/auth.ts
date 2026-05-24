import type { NextAuthOptions } from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

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
					scope: 'user-read-private user-top-read',
				},
			},
			// The Spotify token exchange often exceeds the 3500 ms default
			httpOptions: { timeout: 8000 },
		}),
	],
	callbacks: {
		async jwt({ token, account }) {
			if (account?.provider === 'spotify') {
				token.spotifyAccessToken = account.access_token;
			}
			return token;
		},
		async session({ session, token }) {
			session.spotifyAccessToken = token.spotifyAccessToken;
			return session;
		},
	},
};
