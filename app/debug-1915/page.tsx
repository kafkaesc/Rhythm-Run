'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import SpotifyLoginButton from '@/components/auth/SpotifyLoginButton';
import H1 from '@/components/elements/H1';
import H2 from '@/components/elements/H2';
import SpotifyArtistSearch from '@/components/SpotifyArtistSearch';
import { useSpotifyTopArtists } from '@/hooks/api/useSpotifyApi';

export default function DebugPage() {
	const { data: session } = useSession();
	const { artists: allTimeFavorites } = useSpotifyTopArtists(20);
	const { artists: recentFavorites } = useSpotifyTopArtists(10, true);

	return (
		<>
			<H1 className="text-center">Debug</H1>
			<div className="flex justify-center">
				<SpotifyLoginButton />
			</div>
			{!session && (
				<div className="flex justify-center">
					<Image
						alt="An illustration of Belen Rodriguez. A bug sits on the floor, his shadow fantastically casts a shadow against the wall in the shape of a pleading man. He is Gregor Samsa, the man tragically transformed into a monstrous vermin in Franz Kafka's 'The Metamorphosis.'"
						className="m-1"
						height={256}
						loading="eager"
						src="/belen-rodriguez-bug.jpg"
						width={256}
					/>
				</div>
			)}
			{session && (
				<>
					<div className="grid grid-cols-3 gap-4">
						<div className="col-span-2">
							<H2>Your All-Time Top Artists</H2>
							{allTimeFavorites && (
								<div className="grid grid-cols-2 gap-4">
									<ol className="list-decimal list-inside">
										{allTimeFavorites.slice(0, 10).map((a) => (
											<li key={a.id}>{a.name}</li>
										))}
									</ol>
									<ol className="list-decimal list-inside" start={11}>
										{allTimeFavorites.slice(10).map((a) => (
											<li key={a.id}>{a.name}</li>
										))}
									</ol>
								</div>
							)}
						</div>
						<div>
							<H2>Your Recent Faves</H2>
							{recentFavorites && (
								<ol className="list-decimal list-inside">
									{recentFavorites.map((a) => (
										<li key={a.id}>{a.name}</li>
									))}
								</ol>
							)}
						</div>
					</div>
					<SpotifyArtistSearch />
				</>
			)}
		</>
	);
}
