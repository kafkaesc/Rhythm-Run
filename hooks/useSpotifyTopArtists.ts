'use client';

import { useSpotifyTopArtistsApi } from '@/hooks/api/useSpotifyApi';
import {
	getRandomSpotifyTopArtists,
	getSpotifyTopArtists,
} from '@/lib/spotify';

/**
 * Fetches the logged-in user's top 50 Spotify artists by total
 * listening history. Returns helpers for selecting a random subset
 * or a top n subset of those artists.
 */
export function useSpotifyTopArtists() {
	const { artists, loading, error } = useSpotifyTopArtistsApi(50);

	return {
		artists,
		error,
		getRandomSpotifyTopArtists: (count = 1) =>
			getRandomSpotifyTopArtists(artists, count),
		getSpotifyTopArtists: (count = 1) => getSpotifyTopArtists(artists, count),
		loading,
	};
}
