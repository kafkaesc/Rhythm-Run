import { LfmArtist, LfmTopTrack } from '@/models/lastFm';

// https://www.last.fm/api
export const LAST_FM_ENDPOINT = 'https://ws.audioscrobbler.com/2.0/';
export const LFM_TOP_TRACKS_LIMIT = 100;

/**
 * Search Last.fm for an artist by name and return the best match.
 * Prefers an exact (case-insensitive) name match; falls back to first result.
 *
 * @param name - Artist name to search for
 */
export async function fetchArtistByName(name: string): Promise<LfmArtist | null> {
	const url = new URL('/api/lastfm/artist-search', window.location.origin);
	url.searchParams.set('artist', name);

	const res = await fetch(url, {
		headers: { 'x-api-key': process.env.NEXT_PUBLIC_INTERNAL_API_KEY ?? '' },
	});
	if (!res.ok) throw new Error(`Last.fm search failed: ${res.status}`);

	const artists: LfmArtist[] = await res.json();
	if (!artists.length) return null;

	const exact = artists.find(
		(a) => a.name.toLowerCase() === name.toLowerCase(),
	);
	return exact ?? artists[0];
}

/**
 * Fetch the top tracks for an artist from Last.fm by MBID.
 *
 * @param artistMbid - MusicBrainz ID for an artist
 * @param apiKey - Last.fm API key
 */
export async function fetchArtistTopTracks(
	artistMbid: string,
	apiKey: string,
): Promise<LfmTopTrack[]> {
	// Construct the request for Last.fm
	const url = new URL(LAST_FM_ENDPOINT);
	url.searchParams.set('method', 'artist.gettoptracks');
	url.searchParams.set('api_key', apiKey);
	url.searchParams.set('format', 'json');
	url.searchParams.set('mbid', artistMbid);
	url.searchParams.set('limit', String(LFM_TOP_TRACKS_LIMIT));

	// Await the response and return an error for any non-Ok responses
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Last.fm API error: ${res.status}`);

	// If there are no tracks return an empty array. Last.fm can return a
	// single object instead of an array if there is only one result, so
	// we pack that in an array in that case
	const data = await res.json();
	const tracks = data.toptracks?.track ?? [];
	return Array.isArray(tracks) ? tracks : [tracks];
}
