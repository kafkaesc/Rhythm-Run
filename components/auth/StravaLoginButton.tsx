'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Button from '@/components/elements/Button';
import StravaIcon from '@/components/icons/StravaIcon';

/**
 * Renders a Strava login button when the user is unauthenticated, or their
 * display name and a logout button when they are logged in.
 */
export default function StravaLoginButton() {
	const { data: session, status } = useSession();

	// Loading the session, render nothing
	if (status === 'loading') return null;

	// User is logged in via Spotify, hide this button
	if (session?.spotifyAccessToken) return null;

	// User is logged in via Strava, show their display name and a logout button
	if (session?.stravaAccessToken)
		return (
			<div className="flex items-center gap-2">
				{session.user?.name && (
					<span className="hidden text-sm sm:block">{session.user.name}</span>
				)}
				<Button buttonStyle="black-white" onClick={() => signOut()}>
					Logout
				</Button>
			</div>
		);

	// User is not logged in, show the Strava login button
	return (
		<Button buttonStyle="black-white" onClick={() => signIn('strava')}>
			<span className="inline-flex items-center gap-1">
				<StravaIcon /> Login with Strava
			</span>
		</Button>
	);
}
