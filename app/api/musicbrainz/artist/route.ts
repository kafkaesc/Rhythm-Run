// NEVER use client here:
// this is a server-only route for proxying MusicBrainz API requests

import { NextRequest, NextResponse } from 'next/server';
import { requireApiKey } from '@/lib/api-auth';
import { MB_ARTIST_ENDPOINT, MB_SEARCH_LIMIT } from '@/lib/musicbrainz';

export async function GET(request: NextRequest) {
	const authError = requireApiKey(request);
	if (authError) return authError;

	const artist = request.nextUrl.searchParams.get('artist');

	if (!artist)
		return NextResponse.json({ error: 'artist is required' }, { status: 400 });

	const url = new URL(MB_ARTIST_ENDPOINT);
	url.searchParams.set('query', `artist:"${artist}"`);
	url.searchParams.set('fmt', 'json');
	url.searchParams.set('limit', MB_SEARCH_LIMIT);

	const res = await fetch(url, {
		headers: { 'User-Agent': 'rhythm-run/0.1.0' },
	});

	if (!res.ok)
		return NextResponse.json(
			{ error: 'MusicBrainz API error' },
			{ status: res.status },
		);

	const data = await res.json();
	return NextResponse.json(data.artists ?? []);
}
