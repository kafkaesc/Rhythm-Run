// NEVER use client here:
// this is a server-only MetaMusic route — it orchestrates calls across multiple APIs

import { NextRequest, NextResponse } from 'next/server';
import { fetchArtistTopTracks, enrichWithTempoStream } from '@/lib/metamusic';

export async function GET(request: NextRequest) {
	// Verify the GetSongBPM API key
	const gsbApiKey = process.env.GET_SONG_BPM_KEY;
	if (!gsbApiKey) {
		return NextResponse.json(
			{ error: 'Missing GetSongBPM API key' },
			{ status: 500 },
		);
	}

	// Verify the Last.fm API key
	const lastFmApiKey = process.env.LAST_FM_KEY;
	if (!lastFmApiKey) {
		return NextResponse.json(
			{ error: 'Missing Last.fm API key' },
			{ status: 500 },
		);
	}

	// Verify that artist mbid(s) have been passed
	const artistMbids = request.nextUrl.searchParams.getAll('artistMbid');
	if (!artistMbids.length) {
		return NextResponse.json(
			{ error: 'artistMbid is required' },
			{ status: 400 },
		);
	}

	// Check for the tempo and epsilon details in the request
	const tempo = request.nextUrl.searchParams.get('tempo');
	const epsilon = request.nextUrl.searchParams.get('epsilon');
	const minBpm =
		tempo && epsilon ? parseInt(tempo, 10) - parseInt(epsilon, 10) : null;
	const maxBpm =
		tempo && epsilon ? parseInt(tempo, 10) + parseInt(epsilon, 10) : null;

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
