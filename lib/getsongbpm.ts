// https://getsongbpm.com/api
export const GSB_SEARCH_ENDPOINT = 'https://api.getsong.co/search/';
export const GSB_TEMPO_ENDPOINT = 'https://api.getsong.co/tempo/';
export const GSB_RATE_LIMIT_MS = 750;

/**
 * Looks up the tempo for a single recording via GetSongBPM by title + artist.
 * Returns null if not found or the request fails.
 *
 * @param title - The track title to search for
 * @param artist - The artist name to search for
 * @param apiKey - GetSongBPM API key
 */
export async function fetchGsbTempo(
	title: string,
	artist: string,
	apiKey: string,
): Promise<number | null> {
	const url = new URL(GSB_SEARCH_ENDPOINT);
	url.searchParams.set('api_key', apiKey);
	url.searchParams.set('type', 'both');
	url.searchParams.set('lookup', `song:${title} artist:${artist}`);
	url.searchParams.set('limit', '1');

	// Return null rather than throwing so one failed lookup doesn't abort the stream
	const res = await fetch(url);
	if (!res.ok) {
		const body = await res.text();
		console.warn('fetchGsbTempo failed:', res.status, body, { title, artist });
		return null;
	}

	// Parse the response as JSON and log if it is malformed
	let data;
	try {
		data = await res.json();
	} catch (err) {
		console.error('Failed to parse GetSongBPM response as JSON', err);
		return null;
	}
	const results = data.search;

	// GetSongBPM returns search results under a `search` attribute,
	// if that's missing or empty it means there's no match
	if (!Array.isArray(results) || results.length === 0) return null;

	// Pull the tempo off the GetSongBPM response and parse it to an int
	const tempo = (results[0] as { tempo?: string })?.tempo;
	return tempo ? parseInt(tempo, 10) : null;
}
