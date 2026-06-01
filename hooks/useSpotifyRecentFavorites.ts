'use client';

import { useSpotifyTopArtistsApi } from '@/hooks/api/useSpotifyApi';
import { clamp } from '@/lib/math';
import { SpotifyArtist } from '@/models/spotify';

export function useSpotifyRecentFavorites() {
	const { artists, loading, error } = useSpotifyTopArtistsApi(50, true);

	/**
	 * Get a random set of n artists from the user's Spotify recent top 50
	 * artists from the last 4 weeks, where n is the count argument
	 *
	 * @param count - Optional, default 1, range [1, 50], the number of random artists to get
	 */
	function getRandomSpotifyRecentFavorites(count = 1): SpotifyArtist[] {
		// Clamp to valid count values, we want to carry-on not crash
		const clampedCount = clamp(count, 1, 50);

		// Log warnings for invalid count arguments
		if (count < 1)
			console.warn(
				'getRandomSpotifyRecentFavorites: count should be 1 or greater',
			);
		if (count > 50)
			console.warn(
				'getRandomSpotifyRecentFavorites: count should be 50 or less',
			);

		if (!artists) return [];

		// Log warning if Spotify has less data than requested
		if (clampedCount > artists.length)
			console.warn(
				`getRandomSpotifyRecentFavorites: count ${count} exceeds available artists (${artists.length}), returning ${artists.length} instead`,
			);

		return [...artists].sort(() => Math.random() - 0.5).slice(0, clampedCount);
	}

	/**
	 * Get the user's top n recent favorites from the last 4 weeks, where n is the count argument
	 *
	 * @param count - Optional, default 1, range [1, 50], the number of recent favorites to get
	 */
	function getSpotifyRecentFavorites(count = 1): SpotifyArtist[] {
		// Clamp to valid count values, we want to carry-on not crash
		const clampedCount = clamp(count, 1, 50);

		// Log warnings for invalid count arguments
		if (count < 1)
			console.warn('getSpotifyRecentFavorites: count should be 1 or greater');
		if (count > 50)
			console.warn('getSpotifyRecentFavorites: count should be 50 or less');

		if (!artists) return [];

		// Log warning if Spotify has less data than requested
		if (clampedCount > artists.length)
			console.warn(
				`getSpotifyRecentFavorites: count ${count} exceeds available artists (${artists.length}), returning ${artists.length} instead`,
			);

		return artists.slice(0, clampedCount);
	}

	return {
		error,
		getRandomSpotifyRecentFavorites,
		getSpotifyRecentFavorites,
		loading,
	};
}
