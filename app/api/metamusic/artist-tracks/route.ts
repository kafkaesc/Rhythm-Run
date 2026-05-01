// NEVER use client here:
// this is a server-only MetaMusic route — it orchestrates calls across multiple APIs

import { NextRequest, NextResponse } from 'next/server';
import { fetchArtistRecordings, enrichWithTempoStream } from '@/lib/metamusic';

export async function GET(request: NextRequest) {
	const apiKey = process.env.GET_SONG_BPM_KEY;
	if (!apiKey) {
		return NextResponse.json(
			{ error: 'Error with GetSongBPM API key' },
			{ status: 500 },
		);
	}

	const artistMbids = request.nextUrl.searchParams.getAll('artistMbid');
	if (!artistMbids.length) {
		return NextResponse.json(
			{ error: 'artistMbid is required' },
			{ status: 400 },
		);
	}

	const tempo = request.nextUrl.searchParams.get('tempo');
	const epsilon = request.nextUrl.searchParams.get('epsilon');
	const minBpm = tempo && epsilon ? parseInt(tempo, 10) - parseInt(epsilon, 10) : null;
	const maxBpm = tempo && epsilon ? parseInt(tempo, 10) + parseInt(epsilon, 10) : null;

	let recordings;
	try {
		const recordingsByArtist = await Promise.all(
			artistMbids.map((mbid, i) =>
				new Promise<void>((resolve) => setTimeout(resolve, i * 1000)).then(() =>
					fetchArtistRecordings(mbid),
				),
			),
		);
		recordings = recordingsByArtist.flat();
	} catch {
		return NextResponse.json(
			{ error: 'Failed to fetch recordings from MusicBrainz' },
			{ status: 502 },
		);
	}

	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		async start(controller) {
			try {
				for await (const track of enrichWithTempoStream(recordings, apiKey)) {
					if (minBpm && (track.bpm ?? 0) < minBpm) continue;
					if (maxBpm && (track.bpm ?? Infinity) > maxBpm) continue;
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
