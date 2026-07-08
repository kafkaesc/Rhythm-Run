import { fetchLocalJson, fetchLocalStream } from './api-fetch';

// Replace the global fetch for testing
const mockFetch = jest.fn();
globalThis.fetch = mockFetch;

const originalKey = process.env.NEXT_PUBLIC_INTERNAL_API_KEY;

// Reset after each test
afterEach(() => {
	mockFetch.mockReset();
	process.env.NEXT_PUBLIC_INTERNAL_API_KEY = originalKey;
});

function mockResponse(
	ok: boolean,
	data?: unknown,
	body: ReadableStream<Uint8Array> | null = null,
	status?: number,
): Response {
	return {
		body,
		json: () => Promise.resolve(data),
		ok,
		status: status ?? (ok ? 200 : 500),
	} as unknown as Response;
}

// Returns the URL passed to the most recent fetch call
function lastFetchedUrl(): URL {
	return mockFetch.mock.calls[0][0] as URL;
}

it('Returns the parsed JSON on a successful response', async () => {
	mockFetch.mockResolvedValue(mockResponse(true, { hello: 'world' }));
	const result = await fetchLocalJson(
		'/api/lastfm/artist-search',
		{},
		new AbortController().signal,
		'Last.fm API',
	);
	expect(result).toEqual({ hello: 'world' });
});

it('Builds the URL against the current origin with query params applied', async () => {
	mockFetch.mockResolvedValue(mockResponse(true, []));
	await fetchLocalJson(
		'/api/lastfm/artist-search',
		{ artist: 'Daft Punk', limit: '10' },
		new AbortController().signal,
		'Last.fm API',
	);
	const url = mockFetch.mock.calls[0][0] as URL;
	expect(url.pathname).toBe('/api/lastfm/artist-search');
	expect(url.searchParams.get('artist')).toBe('Daft Punk');
	expect(url.searchParams.get('limit')).toBe('10');
});

it('Attaches the internal API key header', async () => {
	process.env.NEXT_PUBLIC_INTERNAL_API_KEY = 'secret-key';
	mockFetch.mockResolvedValue(mockResponse(true, []));
	await fetchLocalJson(
		'/api/gsb/song',
		{},
		new AbortController().signal,
		'GSB',
	);
	const options = mockFetch.mock.calls[0][1] as RequestInit;
	expect((options.headers as Record<string, string>)['x-api-key']).toBe(
		'secret-key',
	);
});

it('Sends an empty API key header when the env var is unset', async () => {
	delete process.env.NEXT_PUBLIC_INTERNAL_API_KEY;
	mockFetch.mockResolvedValue(mockResponse(true, []));
	await fetchLocalJson(
		'/api/gsb/song',
		{},
		new AbortController().signal,
		'GSB',
	);
	const options = mockFetch.mock.calls[0][1] as RequestInit;
	expect((options.headers as Record<string, string>)['x-api-key']).toBe('');
});

it('Forwards the abort signal to fetch', async () => {
	mockFetch.mockResolvedValue(mockResponse(true, []));
	const signal = new AbortController().signal;
	await fetchLocalJson('/api/gsb/song', {}, signal, 'GSB');
	const options = mockFetch.mock.calls[0][1] as RequestInit;
	expect(options.signal).toBe(signal);
});

it('Throws a labeled error on a non-ok response', async () => {
	mockFetch.mockResolvedValue(mockResponse(false, undefined, null, 404));
	const promise = fetchLocalJson(
		'/api/gsb/song',
		{},
		new AbortController().signal,
		'GetSongBPM API',
	);
	await expect(promise).rejects.toThrow('GetSongBPM API error: 404');
});

it('Has fetchLocalStream return the response body stream', async () => {
	const body = new ReadableStream<Uint8Array>();
	mockFetch.mockResolvedValue(mockResponse(true, undefined, body));
	const result = await fetchLocalStream(
		'/api/test',
		{},
		new AbortController().signal,
		'Test API',
	);
	expect(result).toBe(body);
});

it('Has fetchLocalStream throw a labeled error for a non-ok response', async () => {
	mockFetch.mockResolvedValue(mockResponse(false, undefined, null, 503));
	await expect(
		fetchLocalStream('/api/test', {}, new AbortController().signal, 'Test API'),
	).rejects.toThrow('Test API error: 503');
});

it('Has fetchLocalStream throw a labeled error when the body is missing', async () => {
	mockFetch.mockResolvedValue(mockResponse(true, undefined, null));
	await expect(
		fetchLocalStream('/api/test', {}, new AbortController().signal, 'Test API'),
	).rejects.toThrow('Test API returned no response body');
});

it('Has fetchLocalStream append array params as repeated query keys', async () => {
	const body = new ReadableStream<Uint8Array>();
	mockFetch.mockResolvedValue(mockResponse(true, undefined, body));
	await fetchLocalStream(
		'/api/test',
		{ artistMbid: ['a', 'b'], tempo: '120' },
		new AbortController().signal,
		'Test API',
	);
	const url = lastFetchedUrl();
	expect(url.searchParams.getAll('artistMbid')).toEqual(['a', 'b']);
	expect(url.searchParams.get('tempo')).toBe('120');
});
