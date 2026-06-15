// NEVER use client here:
// this is a server-only route for proxying GetSongBPM API requests

import { NextRequest, NextResponse } from 'next/server';
import { requireApiKey } from '@/lib/api-auth';
import { GSB_TEMPO_ENDPOINT } from '@/lib/getsongbpm';

export async function GET(request: NextRequest) {
	const authError = requireApiKey(request);
	if (authError) return authError;

	// Retrieve credentials for Get Song BPM API access
	const apiKey = process.env.GET_SONG_BPM_KEY;
	if (!apiKey) {
		console.error('GetSongBPM API key is not configured');
		return NextResponse.json(
			{ error: 'Error with GetSongBPM API key' },
			{ status: 500 },
		);
	}

	// Extract the requested bpm
	const bpm = request.nextUrl.searchParams.get('bpm');
	if (!bpm)
		return NextResponse.json({ error: 'bpm is required' }, { status: 400 });

	// Create the URI to request from Get Song BPM
	const uri = new URL(GSB_TEMPO_ENDPOINT);
	uri.searchParams.set('api_key', apiKey);
	uri.searchParams.set('bpm', bpm);

	// Await the response, then branch depending on error or success
	const res = await fetch(uri);

	if (!res.ok) {
		const body = await res.text();
		console.error('GetSongBPM tempo search failed:', res.status, body);
		return NextResponse.json(
			{ error: 'GetSongBPM API error' },
			{ status: res.status },
		);
	}

	const data = await res.json();

	return NextResponse.json(Array.isArray(data) ? data : []);
}
