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

	const mbid = request.nextUrl.searchParams.get('mbid');
	const artist = request.nextUrl.searchParams.get('artist');

	if (!mbid && !artist) {
		return NextResponse.json(
			{ error: 'mbid or artist is required' },
			{ status: 400 },
		);
	}

	const url = new URL(LASTFM_ENDPOINT);
	url.searchParams.set('method', 'artist.gettoptracks');
	url.searchParams.set('api_key', apiKey);
	url.searchParams.set('format', 'json');
	if (mbid) url.searchParams.set('mbid', mbid);
	else if (artist) url.searchParams.set('artist', artist);

	const res = await fetch(url);

	if (!res.ok)
		return NextResponse.json(
			{ error: 'Last.fm API error' },
			{ status: res.status },
		);

	const data = await res.json();
	const tracks = data.toptracks?.track ?? [];

	// Last.fm returns a single object instead of an array when there is only one result
	return NextResponse.json(Array.isArray(tracks) ? tracks : [tracks]);
}
