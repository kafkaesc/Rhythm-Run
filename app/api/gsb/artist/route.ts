// NEVER use client here:
// this is a server-only route for proxying GetSongBPM API requests

import { NextRequest, NextResponse } from 'next/server';

const GSB_SEARCH_ENDPOINT = 'https://api.getsong.co/search/';

export async function GET(request: NextRequest) {
	// Retrieve credentials for Get Song BPM API access
	const apiKey = process.env.GET_SONG_BPM_KEY;
	if (!apiKey) {
		return NextResponse.json(
			{ error: 'Error with GetSongBPM API key' },
			{ status: 500 },
		);
	}

	// Extract the requested artist name
	const artist = request.nextUrl.searchParams.get('artist');
	if (!artist) {
		return NextResponse.json({ error: 'artist is required' }, { status: 400 });
	}

	// Create the URI to request from Get Song BPM
	const uri = new URL(GSB_SEARCH_ENDPOINT);
	uri.searchParams.set('api_key', apiKey);
	uri.searchParams.set('type', 'artist');
	uri.searchParams.set('lookup', artist);

	// Await the response, then branch depending on error or success
	const res = await fetch(uri);

	if (!res.ok)
		return NextResponse.json(
			{ error: 'GetSongBPM API error' },
			{ status: res.status },
		);

	const data = await res.json();
	const results = data.search;

	return NextResponse.json(Array.isArray(results) ? results : []);
}
