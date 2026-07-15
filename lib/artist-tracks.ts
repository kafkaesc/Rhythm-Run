// NEVER use client here: this is a server-only module

import { fetchArtistTopTracks } from '@/lib/lastfm';
import {
	clearNoTempoArtist,
	getCachedTracks,
	getNoTempoArtistDate,
	setCachedTracks,
	setNoTempoArtist,
} from '@/lib/metamusic-cache';
import { LfmTopTrack } from '@/models/lastFm';
import { Track } from '@/models/rhythmRun';

/** Last.fm top tracks for one artist, keyed by the artist's MBID */
export interface ArtistTopTracks {
	mbid: string;
	tracks: LfmTopTrack[];
}

/**
 * Caches an artist's enrichment result, two paths:
 *
 * - Artists with tempo data go to the track cache and clearing any no-tempo entry.
 * - Artists with no tempo data go to the no-tempo cache.
 *
 * @param mbid - MusicBrainz ID of the artist
 * @param enriched - Enriched tracks from the tempo lookup, with or without a BPM
 */
export async function cacheEnrichmentResult(
	mbid: string,
	enriched: Track[],
): Promise<void> {
	const tracksWithBpm = enriched.filter((t) => t.bpm !== undefined);
	if (tracksWithBpm.length === 0) {
		await setNoTempoArtist(mbid);
		return;
	}

	await setCachedTracks(mbid, tracksWithBpm);
	await clearNoTempoArtist(mbid);
}

/**
 * Fetches Last.fm top tracks for each artist, scheduled 1 per second to
 * avoid calling the Last.fm API too quickly. An artist whose fetch fails
 * is recorded in the no-tempo cache and omitted from the results.
 *
 * @param mbids - MusicBrainz IDs of the artists, in search-priority order
 * @param apiKey - Last.fm API key
 */
export async function fetchTopTracksByArtist(
	mbids: string[],
	apiKey: string,
): Promise<ArtistTopTracks[]> {
	// Schedule the Last.fm fetches 1 second apart, then attach the MBID
	// to each result. allSettled is used so one failure won't sink the rest.
	const settled = await Promise.allSettled(
		mbids.map((mbid, i) =>
			new Promise<void>((resolve) => setTimeout(resolve, i * 1000))
				.then(() => fetchArtistTopTracks(mbid, apiKey))
				.then((tracks) => ({ mbid, tracks })),
		),
	);

	// Filter the successful fetches. Artists whose fetch returned
	// as "rejected" or an error go in the no-tempo cache.
	const tracksByArtist: ArtistTopTracks[] = [];
	for (let i = 0; i < settled.length; i++) {
		const result = settled[i];
		if (result.status === 'fulfilled') {
			tracksByArtist.push(result.value);
			continue;
		}

		console.error(
			'Last.fm top tracks fetch failed for',
			mbids[i],
			result.reason,
		);
		await setNoTempoArtist(mbids[i]);
	}

	return tracksByArtist;
}

/**
 * Sorts requested artists into three groups by cache status:
 * - artists whose tempo results are cached and ready immediately
 * - artists who are neither in the tempo cache nor the no-tempo cache
 * - artists who are in the no-tempo cache, to be deferred after the other two
 *
 * @param artistMbids - MusicBrainz IDs of the requested artists
 */
export async function groupByCacheStatus(artistMbids: string[]): Promise<{
	cachedTracks: Track[][];
	deferredMbids: string[];
	unknownMbids: string[];
}> {
	const cachedTracks: Track[][] = [];
	const deferredMbids: string[] = [];
	const unknownMbids: string[] = [];

	for (const mbid of artistMbids) {
		// Tempo-cache hit, the artist's tracks are ready to stream
		const cached = await getCachedTracks(mbid);
		if (cached !== null) {
			cachedTracks.push(cached);
			continue;
		}

		// No-tempo-cache hit => defer the artist, otherwise search first
		const noTempoDate = await getNoTempoArtistDate(mbid);
		if (noTempoDate !== null) deferredMbids.push(mbid);
		else unknownMbids.push(mbid);
	}

	return { cachedTracks, deferredMbids, unknownMbids };
}
