import { LfmBadBunny, LfmDaftPunk } from '@/mocks/LfmArtistMocks';
import { fetchArtistByName, fetchArtistTopTracks } from './lastfm';

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

it('Has fetchArtistByName throw when the response is not ok', async () => {
	mockFetch.mockResolvedValue({
		ok: false,
		status: 500,
	} as unknown as Response);
	await expect(fetchArtistByName('Bad Bunny')).rejects.toThrow(
		'Last.fm search failed: 500',
	);
});

it('Has fetchArtistByName return null when the artists array is empty', async () => {
	mockFetch.mockResolvedValue(mockResponse(true, []));
	const result = await fetchArtistByName('Bad Bunny');
	expect(result).toBeNull();
});

it('Has fetchArtistByName return the exact case-insensitive match', async () => {
	mockFetch.mockResolvedValue(mockResponse(true, [LfmDaftPunk, LfmBadBunny]));
	const result = await fetchArtistByName('bad bunny');
	expect(result).toEqual(LfmBadBunny);
});

it('Has fetchArtistByName fall back to the first result when there is no exact match', async () => {
	mockFetch.mockResolvedValue(mockResponse(true, [LfmDaftPunk, LfmBadBunny]));
	const result = await fetchArtistByName('Flibbertigibbet');
	expect(result).toEqual(LfmDaftPunk);
});

it('Has fetchArtistTopTracks throw when the response is not ok', async () => {
	mockFetch.mockResolvedValue({
		ok: false,
		status: 404,
		text: () => Promise.resolve('Not Found'),
	} as unknown as Response);
	await expect(fetchArtistTopTracks('test-mbid', 'test-key')).rejects.toThrow(
		'Last.fm API error: 404',
	);
});

it('Has fetchArtistTopTracks return an empty array when there are no tracks', async () => {
	mockFetch.mockResolvedValue(mockResponse(true, {}));
	const result = await fetchArtistTopTracks('test-mbid', 'test-key');
	expect(result).toEqual([]);
});

it('Has fetchArtistTopTracks return tracks when the result is an array', async () => {
	const tracks = [
		{ name: 'Basket Case' },
		{ name: 'Boulevard of Broken Dreams' },
	];
	mockFetch.mockResolvedValue(
		mockResponse(true, { toptracks: { track: tracks } }),
	);
	const result = await fetchArtistTopTracks('test-mbid', 'test-key');
	expect(result).toEqual(tracks);
});

it('Has fetchArtistTopTracks wrap a single track in an array when Last.fm returns a non-array', async () => {
	const track = { name: 'Basket Case' };
	mockFetch.mockResolvedValue(mockResponse(true, { toptracks: { track } }));
	const result = await fetchArtistTopTracks('test-mbid', 'test-key');
	expect(result).toEqual([track]);
});
