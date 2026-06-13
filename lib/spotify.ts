import { clamp } from '@/lib/math';
import { SpotifyArtist } from '@/models/spotify';

export const SPOTIFY_ACCOUNTS_ENDPOINT =
	'https://accounts.spotify.com/api/token';

// https://developer.spotify.com/documentation/web-api
export const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';
export const SPOTIFY_CURRENT_USER_ENDPOINT = `${SPOTIFY_BASE_URL}/me`;
export const SPOTIFY_PLAYLISTS_ENDPOINT = `${SPOTIFY_BASE_URL}/me/playlists`;
export const SPOTIFY_SEARCH_ENDPOINT = `${SPOTIFY_BASE_URL}/search`;
export const SPOTIFY_TOP_ARTISTS_ENDPOINT = `${SPOTIFY_BASE_URL}/me/top/artists`;

export const SPOTIFY_SEARCH_LIMIT = '10'; // Spotify API won't allow more than 10
export const SPOTIFY_TOP_ARTIST_LIMIT = 50;

/**
 * Returns a random selection of n artists from the provided list.
 * Count is clamped to [1, 50]; returns an empty array if artists is undefined.
 *
 * @param artists - The pool of artists to select from
 * @param count - Number of artists to return, default 1
 */
export function getRandomSpotifyTopArtists(
	artists: SpotifyArtist[] | null | undefined,
	count = 1,
): SpotifyArtist[] {
	if (count < 1)
		console.warn('getRandomSpotifyTopArtists: count should be 1 or greater');
	if (count > 50)
		console.warn('getRandomSpotifyTopArtists: count should be 50 or less');

	if (!artists) return [];

	const clampedCount = clamp(count, 1, 50);

	if (clampedCount > artists.length)
		console.warn(
			`getRandomSpotifyTopArtists: count ${count} exceeds available artists (${artists.length}), returning ${artists.length} instead`,
		);

	return [...artists].sort(() => Math.random() - 0.5).slice(0, clampedCount);
}

/**
 * Returns the top n artists from the provided list, preserving order.
 * Count is clamped to [1, 50]; returns an empty array if artists is undefined.
 *
 * @param artists - The ordered list of top artists
 * @param count - Number of artists to return, default 1
 */
export function getSpotifyTopArtists(
	artists: SpotifyArtist[] | null | undefined,
	count = 1,
): SpotifyArtist[] {
	if (count < 1)
		console.warn('getSpotifyTopArtists: count should be 1 or greater');
	if (count > 50)
		console.warn('getSpotifyTopArtists: count should be 50 or less');

	if (!artists) return [];

	const clampedCount = clamp(count, 1, 50);

	if (clampedCount > artists.length)
		console.warn(
			`getSpotifyTopArtists: count ${count} exceeds available artists (${artists.length}), returning ${artists.length} instead`,
		);

	return artists.slice(0, clampedCount);
}
