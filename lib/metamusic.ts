import { MbTrack } from '@/models/musicBrainz';
import { Track } from '@/models/rhythmRun';

const MB_RECORDING_BROWSE = 'https://musicbrainz.org/ws/2/recording';
const MB_USER_AGENT = 'rhythm-run/0.1.0';
const MB_BROWSE_LIMIT = '100';

const GSB_SEARCH_ENDPOINT = 'https://api.getsong.co/search/';
const GSB_RATE_LIMIT_MS = 750;

/** Fetches up to 100 recordings for an artist from MusicBrainz by MBID. */
export async function fetchArtistRecordings(
	artistMbid: string,
): Promise<MbTrack[]> {
	// TODO: check cache for artistMbid before fetching

	const url = new URL(MB_RECORDING_BROWSE);
	url.searchParams.set('artist', artistMbid);
	url.searchParams.set('inc', 'artist-credits');
	url.searchParams.set('limit', MB_BROWSE_LIMIT);
	url.searchParams.set('fmt', 'json');

	const res = await fetch(url, {
		headers: { 'User-Agent': MB_USER_AGENT },
	});

	if (!res.ok) throw new Error(`MusicBrainz API error: ${res.status}`);

	const data = await res.json();
	const recordings = (data.recordings as MbTrack[]) ?? [];

	const seen = new Set<string>();
	return recordings.filter((rec) => {
		const key = rec.title.toLowerCase();
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

/** Looks up the tempo for a single recording via GetSongBPM by title + artist.
 *  Returns null if not found or the request fails. */
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
	if (!res.ok) return null;

	let data;
	try {
		data = await res.json();
	} catch {
		return null;
	}
	const results = data.search;

	if (!Array.isArray(results) || results.length === 0) return null;
	const tempo = (results[0] as { tempo?: string })?.tempo;
	return tempo ? parseInt(tempo, 10) : null;
}

/** Yields enriched Track objects one at a time, one GSB request per second. */
export async function* enrichWithTempoStream(
	recordings: MbTrack[],
	apiKey: string,
): AsyncGenerator<Track> {
	for (let i = 0; i < recordings.length; i++) {
		const rec = recordings[i];
		const artist = rec['artist-credit']
			.map((c) => c.name + (c.joinphrase ?? ''))
			.join('');

		const bpm = await fetchGsbTempo(rec.title, artist, apiKey);

		yield {
			id: rec.id,
			title: rec.title,
			artists: [artist],
			...(bpm !== null && { bpm }),
		};

		if (i < recordings.length - 1)
			await new Promise<void>((resolve) =>
				setTimeout(resolve, GSB_RATE_LIMIT_MS),
			);
	}
	// TODO: store complete track list in cache keyed by artistMbid
}
