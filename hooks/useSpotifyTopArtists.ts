'use client';

// Aliased to avoid collision with this hook's own exported name
import { useSpotifyTopArtists as useSpotifyTopArtistsApi } from '@/hooks/api/useSpotifyApi';
import { clamp } from '@/lib/math';
import { SpotifyArtist } from '@/models/spotify';

export function useSpotifyTopArtists() {
	const { artists, loading, error } = useSpotifyTopArtistsApi(50);

	/**
	 * Get a random set of n top artists from the user's Spotify
	 * all time top 50 artists, where n is the count argument
	 *
	 * @param count - Optional, default 1, range [1, 50], the number of random artists to get
	 */
	function getRandomSpotifyTopArtists(count = 1): SpotifyArtist[] {
		// Clamp to valid count values, we want to carry-on not crash
		const clampedCount = clamp(count, 1, 50);

		// Log warnings for invalid count arguments
		if (count < 1)
			console.warn('getRandomSpotifyTopArtists: count should be 1 or greater');
		if (count > 50)
			console.warn('getRandomSpotifyTopArtists: count should be 50 or less');

		if (!artists) return [];

		// Log warning if Spotify has less data than requested
		if (clampedCount > artists.length)
			console.warn(
				`getRandomSpotifyTopArtists: count ${count} exceeds available artists (${artists.length}), returning ${artists.length} instead`,
			);

		return [...artists].sort(() => Math.random() - 0.5).slice(0, clampedCount);
	}

	/**
	 * Get the user's top n artists of all time, where n is the count argument
	 *
	 * @param count - Optional, default 1, range [1, 50], the number of top artists to get
	 */
	function getSpotifyTopArtists(count = 1): SpotifyArtist[] {
		// Clamp to valid count values, we want to carry-on not crash
		const clampedCount = clamp(count, 1, 50);

		// Log warnings for invalid count arguments
		if (count < 1)
			console.warn('getSpotifyTopArtists: count should be 1 or greater');
		if (count > 50)
			console.warn('getSpotifyTopArtists: count should be 50 or less');

		if (!artists) return [];

		// Log warning if Spotify has less data than requested
		if (clampedCount > artists.length)
			console.warn(
				`getSpotifyTopArtists: count ${count} exceeds available artists (${artists.length}), returning ${artists.length} instead`,
			);

		return artists.slice(0, clampedCount);
	}

	return { error, getRandomSpotifyTopArtists, getSpotifyTopArtists, loading };
}
