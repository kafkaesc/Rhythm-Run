'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Button from '@/components/elements/Button';
import H1 from '@/components/elements/H1';
import H2 from '@/components/elements/H2';
import P from '@/components/elements/P';
import SpotifyIcon from '@/components/icons/SpotifyIcon';
import { useSessionStatus } from '@/hooks/useSessionStatus';

export default function Profile() {
	const { session, status } = useSessionStatus();
	const router = useRouter();

	useEffect(() => {
		if (status === 'unauthenticated') router.replace('/login');
	}, [status, router]);

	if (status === 'loading' || !session) return null;

	return (
		<>
			<H1 className="text-center">Profile</H1>
			<H2>Connected Accounts</H2>
			{session.spotifyAccessToken ? (
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-2">
						<SpotifyIcon />
						<P>Spotify — {session.user?.name}</P>
						<Button buttonStyle="black-white" onClick={() => signOut()}>
							Logout from Spotify
						</Button>
					</div>
				</div>
			) : (
				<P>No accounts connected.</P>
			)}
		</>
	);
}
