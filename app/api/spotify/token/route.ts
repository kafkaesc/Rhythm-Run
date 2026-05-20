// NEVER use client here:
// this is a server-only route for fetching the Spotify access token

import { NextRequest, NextResponse } from 'next/server';
import { requireApiKey } from '@/lib/api-auth';
import { SPOTIFY_ACCOUNTS_ENDPOINT } from '@/lib/spotify';

export async function GET(request: NextRequest) {
	const authError = requireApiKey(request);
	if (authError) return authError;

	const clientId = process.env.SPOTIFY_CLIENT_ID;
	const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

	if (!clientId || !clientSecret)
		return NextResponse.json(
			{ error: 'Spotify credentials not configured' },
			{ status: 500 },
		);

	const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
		'base64',
	);

	const res = await fetch(SPOTIFY_ACCOUNTS_ENDPOINT, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${credentials}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: 'grant_type=client_credentials',
	});

	if (!res.ok)
		return NextResponse.json(
			{ error: 'Failed to fetch Spotify token' },
			{ status: res.status },
		);

	const data = (await res.json()) as {
		access_token: string;
		expires_in: number;
	};

	return NextResponse.json({
		accessToken: data.access_token,
		expiresIn: data.expires_in,
	});
}
