'use client';

import { useSpotifyTopArtistsApi } from '@/hooks/api/useSpotifyApi';
import {
	getRandomSpotifyTopArtists,
	getSpotifyTopArtists,
} from '@/lib/spotify';

/**
 * Fetches the logged-in user's top 50 Spotify artists from the last
 * 4 weeks. Returns helpers for selecting a random subset
 * or a top n subset of those artists.
 */
export function useSpotifyRecentFavorites() {
	const { artists, loading, error } = useSpotifyTopArtistsApi(50, true);

	return {
		error,
		getRandomSpotifyRecentFavorites: (count = 1) =>
			getRandomSpotifyTopArtists(artists, count),
		getSpotifyRecentFavorites: (count = 1) =>
			getSpotifyTopArtists(artists, count),
		loading,
	};
}
