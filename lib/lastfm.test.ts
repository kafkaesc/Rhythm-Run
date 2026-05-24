import { fetchArtistTopTracks } from './lastfm';

// Replace the global fetch for testing
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Reset after each test
afterEach(() => {
	mockFetch.mockReset();
});

function mockResponse(ok: boolean, data?: unknown): Response {
	return {
		ok,
		json: () => Promise.resolve(data),
	} as unknown as Response;
}

it('Has fetchArtistTopTracks throw when the response is not ok', async () => {
	mockFetch.mockResolvedValue({ ok: false, status: 404 } as unknown as Response);
	await expect(
		fetchArtistTopTracks('test-mbid', 'test-key'),
	).rejects.toThrow('Last.fm API error: 404');
});

it('Has fetchArtistTopTracks return an empty array when there are no tracks', async () => {
	mockFetch.mockResolvedValue(mockResponse(true, {}));
	const result = await fetchArtistTopTracks('test-mbid', 'test-key');
	expect(result).toEqual([]);
});

it('Has fetchArtistTopTracks return tracks when the result is an array', async () => {
	const tracks = [{ name: 'Basket Case' }, { name: 'Boulevard of Broken Dreams' }];
	mockFetch.mockResolvedValue(
		mockResponse(true, { toptracks: { track: tracks } }),
	);
	const result = await fetchArtistTopTracks('test-mbid', 'test-key');
	expect(result).toEqual(tracks);
});

it('Has fetchArtistTopTracks wrap a single track in an array when Last.fm returns a non-array', async () => {
	const track = { name: 'Basket Case' };
	mockFetch.mockResolvedValue(
		mockResponse(true, { toptracks: { track } }),
	);
	const result = await fetchArtistTopTracks('test-mbid', 'test-key');
	expect(result).toEqual([track]);
});
