'use client';

import type { Session } from 'next-auth';
import Image from 'next/image';
import SpotifyLoginButton from '@/components/auth/SpotifyLoginButton';
import StravaLoginButton from '@/components/auth/StravaLoginButton';
import H1 from '@/components/elements/H1';
import H2 from '@/components/elements/H2';
import P from '@/components/elements/P';
import SpotifyArtistSearch from '@/components/SpotifyArtistSearch';
import { useSessionStatus } from '@/hooks/useSessionStatus';
import { useSpotifyTopArtistsApi } from '@/hooks/api/useSpotifyApi';

function SpotifyDebug({ session }: { session: Session | null }) {
	const { artists: allTimeFavorites } = useSpotifyTopArtistsApi(20);
	const { artists: recentFavorites } = useSpotifyTopArtistsApi(10, true);

	if (!session || !session.spotifyAccessToken) return null;

	return (
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
	);
}

// Placeholder table for now
const ZONE_BPM: { zone: string; label: string; bpm: string }[] = [
	{ zone: 'Zone 1', label: 'Recovery', bpm: '120–140' },
	{ zone: 'Zone 2', label: 'Aerobic', bpm: '140–155' },
	{ zone: 'Zone 3', label: 'Tempo', bpm: '155–165' },
	{ zone: 'Zone 4', label: 'Threshold', bpm: '165–175' },
	{ zone: 'Zone 5', label: 'Max Effort', bpm: '175–185' },
];

function StravaDebug({ session }: { session: Session | null }) {
	if (!session || !session.stravaAccessToken) return null;

	return (
		<>
			<H2>Recommended Music BPM by Zone</H2>
			<table className="w-full text-left">
				<thead>
					<tr>
						<th>Zone</th>
						<th>Effort</th>
						<th>BPM</th>
					</tr>
				</thead>
				<tbody>
					{ZONE_BPM.map(({ zone, label, bpm }) => (
						<tr key={zone}>
							<td>{zone}</td>
							<td>{label}</td>
							<td>{bpm}</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}

export default function DebugPage() {
	const { session } = useSessionStatus();

	return (
		<>
			<H1 className="text-center">Debug</H1>
			<P>
				Login with Spotify should show your all-time favorite artists, your
				recent favorite artists, and allow you to search Spotify artists. Strava
				will only allow one user (not you) until there is a more finished app
				for them to approve, so don&apos;t expect anything from it.
			</P>
			<div className="flex justify-center gap-2">
				<SpotifyLoginButton />
				<StravaLoginButton />
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
			<SpotifyDebug session={session} />
			<StravaDebug session={session} />
		</>
	);
}
