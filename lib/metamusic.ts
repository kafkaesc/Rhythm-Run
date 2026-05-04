import { LfmTopTrack } from '@/models/lastFm';
import { Track } from '@/models/rhythmRun';

export { fetchArtistTopTracks } from '@/lib/lastfm';

const GSB_SEARCH_ENDPOINT = 'https://api.getsong.co/search/';
const GSB_RATE_LIMIT_MS = 750;

/**
 * Looks up the tempo for a single recording via GetSongBPM by title + artist.
 * Returns null if not found or the request fails.
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

	const res = await fetch(url);
	if (!res.ok) {
		return null;
	}

	let data;
	try {
		data = await res.json();
	} catch {
		return null;
	}
	const results = data.search;

	if (!Array.isArray(results) || results.length === 0) {
		return null;
	}
	const tempo = (results[0] as { tempo?: string })?.tempo;
	return tempo ? parseInt(tempo, 10) : null;
}

/**
 * Yields enriched Track objects one at a time, one GSB request per second.
 * Only processes tracks that have MBIDs.
 */
export async function* enrichWithTempoStream(
	tracks: LfmTopTrack[],
	apiKey: string,
): AsyncGenerator<Track> {
	const seen = new Set<string>();
	const tracksWithMbid = tracks.filter((t) => {
		if (!t.mbid) {
			return false;
		}
		if (seen.has(t.mbid)) {
			return false;
		}
		seen.add(t.mbid);
		return true;
	});

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
