'use client';

import { useSession } from 'next-auth/react';

/**
 * A hook that provides details about the current state of the user session,
 * e.g, if they are logged in, if they have a Spotify session active, if they
 * have a Strava session active, etc.
 */
export function useSessionStatus() {
	const { data: session, status } = useSession();

	/** Returns true if the user has an active session */
	function hasSession() {
		return !!session;
	}

	/** Returns true if the user is connected with Spotify */
	function hasSpotify() {
		return !!session?.spotifyAccessToken;
	}

	/** Always false. Strava integration is not yet implemented */
	function hasStrava() {
		return false;
	}

	return { hasSession, hasSpotify, hasStrava, session, status };
}
