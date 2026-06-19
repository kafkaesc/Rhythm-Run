// NEVER use client here:
// this is a server-only MetaMusic route — it orchestrates calls across multiple APIs

import { NextRequest, NextResponse } from 'next/server';
import { requireApiKey } from '@/lib/api-auth';
import { getCachedTracks, setCachedTracks } from '@/lib/cache';
import { inRange } from '@/lib/math';
import { fetchArtistTopTracks } from '@/lib/lastfm';
import { enrichWithTempoStream } from '@/lib/metamusic';
import { Track } from '@/models/rhythmRun';

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
	const epsilonNum = epsilon !== null ? Number.parseInt(epsilon, 10) : 0;
	if (Number.isNaN(epsilonNum))
		return NextResponse.json(
			{ error: 'epsilon must be a number' },
			{ status: 400 },
		);

	// Check cache for each artist, separating hits from misses
	const cachedTracks: Track[][] = [];
	const uncachedMbids: string[] = [];
	for (const mbid of artistMbids) {
		const cached = await getCachedTracks(mbid);
		if (cached !== null) cachedTracks.push(cached);
		else uncachedMbids.push(mbid);
	}

	// For uncached artists, fetch top tracks from Last.fm, staggered by 1 second
	// to avoid calling the Last.fm API too quickly
	let uncachedTracksByArtist: {
		mbid: string;
		tracks: Awaited<ReturnType<typeof fetchArtistTopTracks>>;
	}[] = [];
	if (uncachedMbids.length > 0) {
		try {
			uncachedTracksByArtist = await Promise.all(
				uncachedMbids.map((mbid, i) =>
					new Promise<void>((resolve) => setTimeout(resolve, i * 1000))
						.then(() => fetchArtistTopTracks(mbid, lastFmApiKey))
						.then((tracks) => ({ mbid, tracks })),
				),
			);
		} catch (err) {
			console.error('Last.fm top tracks fetch failed for mbids', uncachedMbids, err);
			return NextResponse.json(
				{ error: 'Failed to fetch top tracks from Last.fm' },
				{ status: 502 },
			);
		}
	}

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
					await setCachedTracks(
						mbid,
						enriched.filter((t) => t.bpm !== undefined),
					);
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
