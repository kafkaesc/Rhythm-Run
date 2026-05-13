import { NextRequest, NextResponse } from 'next/server';

/**
 * Checks the x-api-key header against the configured internal API key.
 * Returns a NextResponse error if the key is missing or wrong, null if valid.
 *
 * @param request - The Next request to validate.
 */
export function requireApiKey(request: NextRequest): NextResponse | null {
	// A missing env var is a server misconfiguration, return 500
	const expectedKey = process.env.NEXT_PUBLIC_INTERNAL_API_KEY;
	if (!expectedKey)
		return NextResponse.json(
			{ error: 'API key not configured' },
			{ status: 500 },
		);

	// Check the request for the key in the x-api-key header
	const providedKey = request.headers.get('x-api-key');
	if (providedKey !== expectedKey)
		return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });

	return null;
}
