// NEVER use client here:
// this is a server-only route for proxying Last.fm API requests

import { NextRequest, NextResponse } from 'next/server';
import { requireApiKey } from '@/lib/api-auth';
import { LAST_FM_ENDPOINT } from '@/lib/lastfm';

export async function GET(request: NextRequest) {
	const authError = requireApiKey(request);
	if (authError) return authError;

	// Verify the Last.fm API key
	const apiKey = process.env.LAST_FM_KEY;
	if (!apiKey) {
		console.error('Last.fm API key is not configured');
		return NextResponse.json(
			{ error: 'Error with Last.fm API key' },
			{ status: 500 },
		);
	}

	// Verify the artist parameter was passed
	const artist = request.nextUrl.searchParams.get('artist');
	if (!artist)
		return NextResponse.json({ error: 'artist is required' }, { status: 400 });

	// Construct the request for Last.fm
	const url = new URL(LAST_FM_ENDPOINT);
	url.searchParams.set('method', 'artist.search');
	url.searchParams.set('artist', artist);
	url.searchParams.set('api_key', apiKey);
	url.searchParams.set('format', 'json');

	// Await the response and return an error for any non-Ok responses
	const res = await fetch(url);
	if (!res.ok) {
		const body = await res.text();
		console.error('Last.fm artist search failed:', res.status, body);
		return NextResponse.json(
			{ error: 'Last.fm API error' },
			{ status: res.status },
		);
	}

	const data = await res.json();
	const artists = data.results?.artistmatches?.artist ?? [];

	// Last.fm returns a single object instead of an array
	// if there is only one result
	const raw = Array.isArray(artists) ? artists : [artists];

	// Last.fm can return duplicate entries with the same MBID (e.g. multiple
	// Green Day results) so we filter out duplicates by MBID
	const seen = new Set<string>();
	const deduped = raw.filter((a: { mbid?: string }) => {
		if (!a.mbid) return true;
		if (seen.has(a.mbid)) return false;
		seen.add(a.mbid);
		return true;
	});

	return NextResponse.json(deduped);
}
