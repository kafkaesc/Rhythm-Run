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
	const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
	delete process.env.NEXT_PUBLIC_INTERNAL_API_KEY;
	const result = requireApiKey(makeRequest(VALID_KEY));
	expect(result).not.toBeNull();
	expect(result!.status).toBe(500);
	const resultJson = await result!.json();
	expect(resultJson).toEqual({ error: 'API key not configured' });
	expect(errorSpy).toHaveBeenCalledWith('Internal API key is not configured');
	errorSpy.mockRestore();
});

it('Has requireApiKey return 401 when the x-api-key header is missing', async () => {
	const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
	process.env.NEXT_PUBLIC_INTERNAL_API_KEY = VALID_KEY;
	const result = requireApiKey(makeRequest());
	expect(result).not.toBeNull();
	expect(result!.status).toBe(401);
	const resultJson = await result!.json();
	expect(resultJson).toEqual({ error: 'Invalid API key' });
	expect(warnSpy).toHaveBeenCalledWith('Invalid API key on', '/api/test');
	warnSpy.mockRestore();
});

it('Has requireApiKey return 401 when the x-api-key header is incorrect', async () => {
	const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
	process.env.NEXT_PUBLIC_INTERNAL_API_KEY = VALID_KEY;
	const result = requireApiKey(makeRequest('wrong-key'));
	expect(result).not.toBeNull();
	expect(result!.status).toBe(401);
	const resultJson = await result!.json();
	expect(resultJson).toEqual({ error: 'Invalid API key' });
	expect(warnSpy).toHaveBeenCalledWith('Invalid API key on', '/api/test');
	warnSpy.mockRestore();
});

it('Has requireApiKey return null when the key is correct', () => {
	process.env.NEXT_PUBLIC_INTERNAL_API_KEY = VALID_KEY;
	expect(requireApiKey(makeRequest(VALID_KEY))).toBeNull();
});
