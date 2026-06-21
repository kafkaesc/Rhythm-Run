import { renderHook, waitFor } from '@testing-library/react';
import { LfmBadBunny, LfmDaftPunk } from '@/mocks/LfmArtistMocks';
import {
	LfmSearchBasketCase,
	LfmSearchFeelGoodInc,
} from '@/mocks/LfmSearchTrackMocks';
import { LfmBasketCase, LfmFeelGoodInc } from '@/mocks/LfmTopTrackMocks';
import {
	useLastFmArtistSearch,
	useLastFmArtistTopTracks,
	useLastFmTrackSearch,
} from './useLastFmApi';

const mockFetch = jest.fn();
global.fetch = mockFetch;

afterEach(() => {
	mockFetch.mockReset();
});

function mockResponse(ok: boolean, data?: unknown, status?: number): Response {
	return {
		ok,
		status: status ?? (ok ? 200 : 500),
		json: () => Promise.resolve(data),
	} as unknown as Response;
}

// useLastFmArtistSearch

it('Returns null artists and not loading when artist is null', () => {
	const { result } = renderHook(() => useLastFmArtistSearch(null));
	expect(result.current.artists).toBeNull();
	expect(result.current.loading).toBe(false);
	expect(mockFetch).not.toHaveBeenCalled();
});

it('Returns loading true while the artist search fetch is in flight', () => {
	mockFetch.mockReturnValue(new Promise(() => {}));
	const { result } = renderHook(() => useLastFmArtistSearch('Bad Bunny'));
	expect(result.current.loading).toBe(true);
});

it('Returns artists on a successful artist search fetch', async () => {
	mockFetch.mockResolvedValue(mockResponse(true, [LfmBadBunny, LfmDaftPunk]));
	const { result } = renderHook(() => useLastFmArtistSearch('Bad Bunny'));
	await waitFor(() => expect(result.current.loading).toBe(false));

	expect(result.current.artists).toEqual([LfmBadBunny, LfmDaftPunk]);
	expect(result.current.error).toBeNull();
});

it('Returns an error when the artist search fetch is not ok', async () => {
	mockFetch.mockResolvedValue(mockResponse(false));
	const { result } = renderHook(() => useLastFmArtistSearch('Bad Bunny'));
	await waitFor(() => expect(result.current.loading).toBe(false));

	expect(result.current.error).toBe('Last.fm API error: 500');
	expect(result.current.artists).toBeNull();
});

// useLastFmArtistTopTracks

it('Returns null tracks and not loading when both mbid and artist are null', () => {
	const { result } = renderHook(() => useLastFmArtistTopTracks(null, null));
	expect(result.current.tracks).toBeNull();
	expect(result.current.loading).toBe(false);
	expect(mockFetch).not.toHaveBeenCalled();
});

it('Returns loading true while the top tracks fetch is in flight', () => {
	mockFetch.mockReturnValue(new Promise(() => {}));
	const { result } = renderHook(() =>
		useLastFmArtistTopTracks('056e4f3e-d505-4dad-8ec1-d04f521cbb56'),
	);
	expect(result.current.loading).toBe(true);
});

it('Uses the mbid param when mbid is provided', async () => {
	mockFetch.mockResolvedValue(mockResponse(true, []));
	renderHook(() =>
		useLastFmArtistTopTracks('056e4f3e-d505-4dad-8ec1-d04f521cbb56'),
	);
	await waitFor(() => expect(mockFetch).toHaveBeenCalled());
	const url: URL = mockFetch.mock.calls[0][0];
	expect(url.searchParams.get('mbid')).toBe(
		'056e4f3e-d505-4dad-8ec1-d04f521cbb56',
	);
	expect(url.searchParams.get('artist')).toBeNull();
});

it('Falls back to the artist param when mbid is null', async () => {
	mockFetch.mockResolvedValue(mockResponse(true, []));
	renderHook(() => useLastFmArtistTopTracks(null, 'Daft Punk'));
	await waitFor(() => expect(mockFetch).toHaveBeenCalled());
	const url: URL = mockFetch.mock.calls[0][0];
	expect(url.searchParams.get('artist')).toBe('Daft Punk');
	expect(url.searchParams.get('mbid')).toBeNull();
});

it('Prefers mbid over artist when both are provided', async () => {
	mockFetch.mockResolvedValue(mockResponse(true, []));
	renderHook(() =>
		useLastFmArtistTopTracks(
			'056e4f3e-d505-4dad-8ec1-d04f521cbb56',
			'Daft Punk',
		),
	);
	await waitFor(() => expect(mockFetch).toHaveBeenCalled());
	const url: URL = mockFetch.mock.calls[0][0];
	expect(url.searchParams.get('mbid')).toBe(
		'056e4f3e-d505-4dad-8ec1-d04f521cbb56',
	);
	expect(url.searchParams.get('artist')).toBeNull();
});

it('Returns tracks on a successful top tracks fetch', async () => {
	mockFetch.mockResolvedValue(
		mockResponse(true, [LfmBasketCase, LfmFeelGoodInc]),
	);
	const { result } = renderHook(() =>
		useLastFmArtistTopTracks('056e4f3e-d505-4dad-8ec1-d04f521cbb56'),
	);
	await waitFor(() => expect(result.current.loading).toBe(false));

	expect(result.current.tracks).toEqual([LfmBasketCase, LfmFeelGoodInc]);
	expect(result.current.error).toBeNull();
});

it('Returns an error when the top tracks fetch is not ok', async () => {
	mockFetch.mockResolvedValue(mockResponse(false, undefined, 404));
	const { result } = renderHook(() =>
		useLastFmArtistTopTracks('056e4f3e-d505-4dad-8ec1-d04f521cbb56'),
	);
	await waitFor(() => expect(result.current.loading).toBe(false));

	expect(result.current.error).toBe('Last.fm API error: 404');
	expect(result.current.tracks).toBeNull();
});

// useLastFmTrackSearch

it('Returns null tracks and not loading when track is null', () => {
	const { result } = renderHook(() => useLastFmTrackSearch(null));
	expect(result.current.tracks).toBeNull();
	expect(result.current.loading).toBe(false);
	expect(mockFetch).not.toHaveBeenCalled();
});

it('Returns loading true while the track search fetch is in flight', () => {
	mockFetch.mockReturnValue(new Promise(() => {}));
	const { result } = renderHook(() => useLastFmTrackSearch('Basket Case'));
	expect(result.current.loading).toBe(true);
});

it('Fetches without an artist param when artist is not provided', async () => {
	mockFetch.mockResolvedValue(mockResponse(true, []));
	renderHook(() => useLastFmTrackSearch('Basket Case'));
	await waitFor(() => expect(mockFetch).toHaveBeenCalled());
	const url: URL = mockFetch.mock.calls[0][0];
	expect(url.searchParams.get('track')).toBe('Basket Case');
	expect(url.searchParams.get('artist')).toBeNull();
});

it('Includes the artist param when artist is provided', async () => {
	mockFetch.mockResolvedValue(mockResponse(true, []));
	renderHook(() => useLastFmTrackSearch('Basket Case', 'Green Day'));
	await waitFor(() => expect(mockFetch).toHaveBeenCalled());
	const url: URL = mockFetch.mock.calls[0][0];
	expect(url.searchParams.get('track')).toBe('Basket Case');
	expect(url.searchParams.get('artist')).toBe('Green Day');
});

it('Returns tracks on a successful track search fetch', async () => {
	mockFetch.mockResolvedValue(
		mockResponse(true, [LfmSearchBasketCase, LfmSearchFeelGoodInc]),
	);
	const { result } = renderHook(() => useLastFmTrackSearch('Basket Case'));
	await waitFor(() => expect(result.current.loading).toBe(false));

	expect(result.current.tracks).toEqual([
		LfmSearchBasketCase,
		LfmSearchFeelGoodInc,
	]);
	expect(result.current.error).toBeNull();
});

it('Returns an error when the track search fetch is not ok', async () => {
	mockFetch.mockResolvedValue(mockResponse(false));
	const { result } = renderHook(() => useLastFmTrackSearch('Basket Case'));
	await waitFor(() => expect(result.current.loading).toBe(false));

	expect(result.current.error).toBe('Last.fm API error: 500');
	expect(result.current.tracks).toBeNull();
});
