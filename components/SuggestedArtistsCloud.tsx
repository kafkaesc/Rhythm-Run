'use client';

import A from '@/components/elements/A';
import { useSpotifyTopArtists } from '@/hooks/useSpotifyTopArtists';

/** Renders a cloud of 8 randomly selected artists from the user's Spotify top 50 */
export default function SuggestedArtistsCloud() {
	const { getRandomSpotifyTopArtists, loading } = useSpotifyTopArtists();

	if (loading) return null;

	const suggested = getRandomSpotifyTopArtists(8);

	if (suggested.length === 0) return null;

	return (
		<ul className="flex flex-wrap gap-3">
			{suggested.map((artist) => (
				<li key={artist.id}>
					<A href={artist.external_urls.spotify}>{artist.name}</A>
				</li>
			))}
		</ul>
	);
}
