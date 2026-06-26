import { fetchLocalJson } from './api-fetch';

const mockFetch = jest.fn();
globalThis.fetch = mockFetch;

const originalKey = process.env.NEXT_PUBLIC_INTERNAL_API_KEY;

afterEach(() => {
	mockFetch.mockReset();
	process.env.NEXT_PUBLIC_INTERNAL_API_KEY = originalKey;
});

function mockResponse(ok: boolean, data?: unknown, status?: number): Response {
	return {
		ok,
		status: status ?? (ok ? 200 : 500),
		json: () => Promise.resolve(data),
	} as unknown as Response;
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
	mockFetch.mockResolvedValue(mockResponse(false, undefined, 404));
	const promise = fetchLocalJson(
		'/api/gsb/song',
		{},
		new AbortController().signal,
		'GetSongBPM API',
	);
	await expect(promise).rejects.toThrow('GetSongBPM API error: 404');
});
