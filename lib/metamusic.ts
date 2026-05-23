import { LfmTopTrack } from '@/models/lastFm';
import { Track } from '@/models/rhythmRun';

export { fetchArtistTopTracks } from '@/lib/lastfm';

// https://getsongbpm.com/api
export const GSB_SEARCH_ENDPOINT = 'https://api.getsong.co/search/';
export const GSB_RATE_LIMIT_MS = 750;

/**
 * Looks up the tempo for a single recording via GetSongBPM by title + artist.
 * Returns null if not found or the request fails.
 *
 * @param title - The track title to search for
 * @param artist - The artist name to search for
 * @param apiKey - GetSongBPM API key
 */
async function fetchGsbTempo(
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
	if (!res.ok) return null;

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

/**
 * Yields enriched Track objects one at a time, one GetSongBPM request
 * per second. Only processes tracks that have MBIDs.
 *
 * @param tracks - Last.fm top tracks to enrich with tempo data
 * @param apiKey - GetSongBPM API key
 */
export async function* enrichWithTempoStream(
	tracks: LfmTopTrack[],
	apiKey: string,
): AsyncGenerator<Track> {
	// Construct the tracksWithMbid array by filtering out tracks without
	// an MBID and skipping any duplicates returned by Last.fm
	const seen = new Set<string>();
	const tracksWithMbid = tracks.filter((tr) => {
		// If no MBID, can't lookup tempo on GetSongBPM reliably
		if (!tr.mbid) return false;

		// Check if Last.fm has already returned same recording for the artist
		if (seen.has(tr.mbid)) return false;

		seen.add(tr.mbid);
		return true;
	});

	// Iterate through the tracksWithMbid array and look up
	// tempo data for them one at a time from GetSongBPM
	for (let i = 0; i < tracksWithMbid.length; i++) {
		const track = tracksWithMbid[i];
		const bpm = await fetchGsbTempo(track.name, track.artist.name, apiKey);

		yield {
			id: track.mbid,
			title: track.name,
			artists: [track.artist.name],
			mbid: track.mbid,
			...(bpm !== null && { bpm }),
		};

		if (i < tracksWithMbid.length - 1) {
			await new Promise<void>((resolve) =>
				setTimeout(resolve, GSB_RATE_LIMIT_MS),
			);
		}
	}
}
