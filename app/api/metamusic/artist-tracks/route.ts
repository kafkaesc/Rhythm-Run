// NEVER use client here:
// this is a server-only MetaMusic route — it orchestrates calls across multiple APIs

import { NextRequest, NextResponse } from 'next/server';
import { fetchArtistTopTracks, enrichWithTempoStream } from '@/lib/metamusic';
import { requireApiKey } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
	const authError = requireApiKey(request);
	if (authError) return authError;

	// Verify the GetSongBPM API key
	const gsbApiKey = process.env.GET_SONG_BPM_KEY;
	if (!gsbApiKey)
		return NextResponse.json(
			{ error: 'Missing GetSongBPM API key' },
			{ status: 500 },
		);

	// Verify the Last.fm API key
	const lastFmApiKey = process.env.LAST_FM_KEY;
	if (!lastFmApiKey)
		return NextResponse.json(
			{ error: 'Missing Last.fm API key' },
			{ status: 500 },
		);

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

	if (tempo === null)
		return NextResponse.json({ error: 'tempo is required' }, { status: 400 });

	const tempoNum = parseInt(tempo, 10);
	if (isNaN(tempoNum))
		return NextResponse.json(
			{ error: 'tempo must be a number' },
			{ status: 400 },
		);

	const epsilonNum = epsilon !== null ? parseInt(epsilon, 10) : 0;
	if (isNaN(epsilonNum))
		return NextResponse.json(
			{ error: 'epsilon must be a number' },
			{ status: 400 },
		);

	const minBpm = tempoNum - epsilonNum;
	const maxBpm = tempoNum + epsilonNum;

	// Fetch the top tracks for each artist, staggered by 1 second
	// to avoid calling the Last.fm API too quickly
	let tracks;
	try {
		const tracksByArtist = await Promise.all(
			artistMbids.map((mbid, i) =>
				new Promise<void>((resolve) => setTimeout(resolve, i * 1000)).then(() =>
					fetchArtistTopTracks(mbid, lastFmApiKey),
				),
			),
		);
		tracks = tracksByArtist.flat();
	} catch {
		return NextResponse.json(
			{ error: 'Failed to fetch top tracks from Last.fm' },
			{ status: 502 },
		);
	}

	// Construct a web stream as a response to return tracks as they are
	// enriched because waiting for the entire response to enrich is slowww
	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		async start(controller) {
			try {
				for await (const track of enrichWithTempoStream(tracks, gsbApiKey)) {
					if (minBpm && (track.bpm ?? 0) < minBpm) {
						continue;
					}
					if (maxBpm && (track.bpm ?? Infinity) > maxBpm) {
						continue;
					}
					controller.enqueue(encoder.encode(JSON.stringify(track) + '\n'));
				}
			} finally {
				controller.close();
			}
		},
	});

	return new Response(stream, {
		headers: { 'Content-Type': 'application/x-ndjson' },
	});
}
