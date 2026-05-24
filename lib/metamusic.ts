import { fetchGsbTempo, GSB_RATE_LIMIT_MS } from '@/lib/getsongbpm';
import { LfmTopTrack } from '@/models/lastFm';
import { Track } from '@/models/rhythmRun';

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
