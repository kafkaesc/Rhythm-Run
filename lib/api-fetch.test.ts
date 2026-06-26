import { fetchLocalJson, fetchLocalStream } from './api-fetch';

// Replace the global fetch for testing
const mockFetch = jest.fn();
globalThis.fetch = mockFetch;

// Reset after each test
afterEach(() => {
	mockFetch.mockReset();
});

function mockResponse(
	ok: boolean,
	data?: unknown,
	body: ReadableStream<Uint8Array> | null = null,
	status = 200,
): Response {
	return {
		body,
		json: () => Promise.resolve(data),
		ok,
		status,
	} as unknown as Response;
}

// Returns the URL passed to the most recent fetch call
function lastFetchedUrl(): URL {
	return mockFetch.mock.calls[0][0] as URL;
}

it('Has fetchLocalJson return the parsed JSON payload', async () => {
	mockFetch.mockResolvedValue(mockResponse(true, { hello: 'world' }));
	const data = await fetchLocalJson(
		'/api/test',
		{ q: 'x' },
		new AbortController().signal,
		'Test API',
	);
	expect(data).toEqual({ hello: 'world' });
});

it('Has fetchLocalJson throw a labeled error for a non-ok response', async () => {
	mockFetch.mockResolvedValue(mockResponse(false, undefined, null, 500));
	await expect(
		fetchLocalJson('/api/test', {}, new AbortController().signal, 'Test API'),
	).rejects.toThrow('Test API error: 500');
});

it('Has fetchLocalJson set the internal API key header', async () => {
	mockFetch.mockResolvedValue(mockResponse(true, {}));
	await fetchLocalJson(
		'/api/test',
		{},
		new AbortController().signal,
		'Test API',
	);
	const init = mockFetch.mock.calls[0][1];
	expect(init.headers).toHaveProperty('x-api-key');
});

it('Has fetchLocalJson append a string param to the URL', async () => {
	mockFetch.mockResolvedValue(mockResponse(true, {}));
	await fetchLocalJson(
		'/api/test',
		{ artist: 'Green Day' },
		new AbortController().signal,
		'Test API',
	);
	expect(lastFetchedUrl().searchParams.get('artist')).toBe('Green Day');
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
