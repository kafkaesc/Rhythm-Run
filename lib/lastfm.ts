import { LfmTopTrack } from '@/models/lastFm';

const LAST_FM_ENDPOINT = 'https://ws.audioscrobbler.com/2.0/';

/** Fetch the top tracks for an artist from Last.fm by MBID. */
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

	// Await the response and return an error for any non-Ok responses
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`Last.fm API error: ${res.status}`);
	}

	// If there are no tracks return an empty array. Last.fm can return a
	// single object instead of an array if there is only one result, so
	// we pack that in an array in that case
	const data = await res.json();
	const tracks = data.toptracks?.track ?? [];
	return Array.isArray(tracks) ? tracks : [tracks];
}
