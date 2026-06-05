'use client';

import { useSpotifyTopArtistsApi } from '@/hooks/api/useSpotifyApi';
import {
	getRandomSpotifyTopArtists,
	getSpotifyTopArtists,
} from '@/lib/spotify';

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
