'use client';

import { useSpotifyTopArtistsApi } from '@/hooks/api/useSpotifyApi';
import {
	getRandomSpotifyTopArtists,
	getSpotifyTopArtists,
} from '@/lib/spotify';

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
