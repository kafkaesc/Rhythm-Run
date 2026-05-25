'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import SpotifyLoginButton from '@/components/auth/SpotifyLoginButton';
import H1 from '@/components/elements/H1';
import P from '@/components/elements/P';
import { useSessionStatus } from '@/hooks/useSessionStatus';

export default function Login() {
	const { session, status } = useSessionStatus();
	const router = useRouter();

	useEffect(() => {
		if (session) router.replace('/profile');
	}, [session, router]);

	if (status === 'loading' || session) return null;

	return (
		<>
			<H1 className="text-center">Login</H1>
			<P className="text-center">Login available with Spotify</P>
			<div className="flex justify-center">
				<SpotifyLoginButton />
			</div>
		</>
	);
}
