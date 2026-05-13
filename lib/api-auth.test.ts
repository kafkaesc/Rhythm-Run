/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { requireApiKey } from './api-auth';

const VALID_KEY = 'test-api-key';
const ORIGINAL_KEY = process.env.NEXT_PUBLIC_INTERNAL_API_KEY;

afterEach(() => {
	if (ORIGINAL_KEY !== undefined)
		process.env.NEXT_PUBLIC_INTERNAL_API_KEY = ORIGINAL_KEY;
	else delete process.env.NEXT_PUBLIC_INTERNAL_API_KEY;
});

function makeRequest(apiKey?: string): NextRequest {
	const headers: HeadersInit =
		apiKey !== undefined ? { 'x-api-key': apiKey } : {};
	return new NextRequest('http://localhost/api/test', { headers });
}

it('Has requireApiKey return 500 when the env var is not configured', async () => {
	delete process.env.NEXT_PUBLIC_INTERNAL_API_KEY;
	const result = requireApiKey(makeRequest(VALID_KEY));
	expect(result).not.toBeNull();
	expect(result!.status).toBe(500);
	const resultJson = await result!.json();
	expect(resultJson).toEqual({ error: 'API key not configured' });
});

it('Has requireApiKey return 401 when the x-api-key header is missing', async () => {
	process.env.NEXT_PUBLIC_INTERNAL_API_KEY = VALID_KEY;
	const result = requireApiKey(makeRequest());
	expect(result).not.toBeNull();
	expect(result!.status).toBe(401);
	const resultJson = await result!.json();
	expect(resultJson).toEqual({ error: 'Invalid API key' });
});

it('Has requireApiKey return 401 when the x-api-key header is incorrect', async () => {
	process.env.NEXT_PUBLIC_INTERNAL_API_KEY = VALID_KEY;
	const result = requireApiKey(makeRequest('wrong-key'));
	expect(result).not.toBeNull();
	expect(result!.status).toBe(401);
	const resultJson = await result!.json();
	expect(resultJson).toEqual({ error: 'Invalid API key' });
});

it('Has requireApiKey return null when the key is correct', () => {
	process.env.NEXT_PUBLIC_INTERNAL_API_KEY = VALID_KEY;
	expect(requireApiKey(makeRequest(VALID_KEY))).toBeNull();
});
