// NEVER use client here:
// this is a server-only route for proxying Last.fm API requests

import { NextRequest, NextResponse } from 'next/server';

const LASTFM_ENDPOINT = 'https://ws.audioscrobbler.com/2.0/';

export async function GET(request: NextRequest) {
	const apiKey = process.env.LAST_FM_KEY;
	if (!apiKey) {
		return NextResponse.json(
			{ error: 'Error with Last.fm API key' },
			{ status: 500 },
		);
	}

	const track = request.nextUrl.searchParams.get('track');
	if (!track) {
		return NextResponse.json(
			{ error: 'track is required' },
			{ status: 400 },
		);
	}

	const url = new URL(LASTFM_ENDPOINT);
	url.searchParams.set('method', 'track.search');
	url.searchParams.set('track', track);
	url.searchParams.set('api_key', apiKey);
	url.searchParams.set('format', 'json');

	const artist = request.nextUrl.searchParams.get('artist');
	if (artist) url.searchParams.set('artist', artist);

	const res = await fetch(url);

	if (!res.ok)
		return NextResponse.json(
			{ error: 'Last.fm API error' },
			{ status: res.status },
		);

	const data = await res.json();
	const tracks = data.results?.trackmatches?.track ?? [];

	// Last.fm returns a single object instead of an array when there is only one result
	return NextResponse.json(Array.isArray(tracks) ? tracks : [tracks]);
}
