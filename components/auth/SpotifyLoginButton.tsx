'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Button from '@/components/elements/Button';
import SpotifyIcon from '@/components/icons/SpotifyIcon';

/**
 * Renders a Spotify login button when the user is unauthenticated, or their
 * display name and a logout button when they are logged in.
 */
export default function SpotifyLoginButton() {
	const { data: session, status } = useSession();

	// Loading the session, render nothing
	if (status === 'loading') return null;

	// User is logged in, show their display name and a logout button
	if (session)
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

	// User is not logged in, show the Spotify login button
	return (
		<Button buttonStyle="black-white" onClick={() => signIn('spotify')}>
			<span className="inline-flex items-center gap-1">
				<SpotifyIcon /> Login with Spotify
			</span>
		</Button>
	);
}
