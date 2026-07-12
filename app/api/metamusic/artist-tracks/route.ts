// NEVER use client here:
// this is a server-only MetaMusic route — it orchestrates calls across multiple APIs

import { NextRequest, NextResponse } from 'next/server';
import { requireApiKey } from '@/lib/api-auth';
import { fetchArtistTopTracks } from '@/lib/lastfm';
import { inRange } from '@/lib/math';
import { enrichWithTempoStream } from '@/lib/metamusic';
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
interface ArtistTopTracks {
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
async function cacheEnrichmentResult(
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
async function fetchTopTracksByArtist(
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
async function groupByCacheStatus(artistMbids: string[]): Promise<{
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

export async function GET(request: NextRequest) {
	const authError = requireApiKey(request);
	if (authError) return authError;

	// Verify the GetSongBPM API key
	const gsbApiKey = process.env.GET_SONG_BPM_KEY;
	if (!gsbApiKey) {
		console.error('GetSongBPM API key is not configured');
		return NextResponse.json(
			{ error: 'Missing GetSongBPM API key' },
			{ status: 500 },
		);
	}

	// Verify the Last.fm API key
	const lastFmApiKey = process.env.LAST_FM_KEY;
	if (!lastFmApiKey) {
		console.error('Last.fm API key is not configured');
		return NextResponse.json(
			{ error: 'Missing Last.fm API key' },
			{ status: 500 },
		);
	}

	// Verify that artist mbid(s) have been passed
	const artistMbids = request.nextUrl.searchParams.getAll('artistMbid');
	if (!artistMbids.length)
		return NextResponse.json(
			{ error: 'artistMbid is required' },
			{ status: 400 },
		);

	// Check and validate the tempo and epsilon details in the request
	const tempo = request.nextUrl.searchParams.get('tempo');
	const epsilon = request.nextUrl.searchParams.get('epsilon');

	// Error if the tempo is not provided, it's critical
	if (tempo === null)
		return NextResponse.json({ error: 'tempo is required' }, { status: 400 });

	// Validate the tempo
	const tempoNum = Number.parseInt(tempo, 10);
	if (Number.isNaN(tempoNum))
		return NextResponse.json(
			{ error: 'tempo must be a number' },
			{ status: 400 },
		);

	// Validate the epsilon or set to zero
	const epsilonNum = epsilon === null ? 0 : Number.parseInt(epsilon, 10);
	if (Number.isNaN(epsilonNum))
		return NextResponse.json(
			{ error: 'epsilon must be a number' },
			{ status: 400 },
		);

	// Sort the artists by cache status: cached tempo data stream immediately,
	// unknown artists are searched first, no-tempo artists are searched last
	const { cachedTracks, deferredMbids, unknownMbids } =
		await groupByCacheStatus(artistMbids);

	// Fetch top tracks from Last.fm for the artists that need a search,
	// keeping the unknown-first, no-tempo-last priority order
	const uncachedTracksByArtist = await fetchTopTracksByArtist(
		[...unknownMbids, ...deferredMbids],
		lastFmApiKey,
	);

	// Construct a web stream as a response to return tracks as they are
	// enriched because waiting for the entire response to enrich is slowww
	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		async start(controller) {
			try {
				// Send cached tracks immediately, filtered to the requested BPM range
				for (const tracks of cachedTracks) {
					for (const tr of tracks) {
						if (tr.bpm !== undefined && inRange(tr.bpm, tempoNum, epsilonNum))
							controller.enqueue(encoder.encode(JSON.stringify(tr) + '\n'));
					}
				}

				// Enrich uncached artists one at a time, streaming and caching results
				for (const { mbid, tracks } of uncachedTracksByArtist) {
					const enriched: Track[] = [];
					for await (const track of enrichWithTempoStream(tracks, gsbApiKey)) {
						enriched.push(track);
						if (
							track.bpm !== undefined &&
							inRange(track.bpm, tempoNum, epsilonNum)
						)
							controller.enqueue(encoder.encode(JSON.stringify(track) + '\n'));
					}
					await cacheEnrichmentResult(mbid, enriched);
				}
			} catch (err) {
				console.error('MetaMusic stream failed:', err);
			} finally {
				controller.close();
			}
		},
	});

	return new Response(stream, {
		headers: { 'Content-Type': 'application/x-ndjson' },
	});
}
