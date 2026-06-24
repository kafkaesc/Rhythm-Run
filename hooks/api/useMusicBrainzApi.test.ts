import { renderHook, waitFor } from '@testing-library/react';
import { MbBadBunny, MbDaftPunk } from '@/mocks/MbArtistMocks';
import { MbBasketCase, MbFeelGoodInc } from '@/mocks/MbTrackMocks';
import {
	useMusicBrainzArtistSearch,
	useMusicBrainzTrackSearch,
} from './useMusicBrainzApi';

const mockFetch = jest.fn();
globalThis.fetch = mockFetch;

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

// useMusicBrainzArtistSearch

it('Returns null artists and not loading when artist is null', () => {
	const { result } = renderHook(() => useMusicBrainzArtistSearch(null));
	expect(result.current.artists).toBeNull();
	expect(result.current.loading).toBe(false);
	expect(mockFetch).not.toHaveBeenCalled();
});

it('Returns loading true while the artist fetch is in flight', () => {
	mockFetch.mockReturnValue(new Promise(() => {}));
	const { result } = renderHook(() => useMusicBrainzArtistSearch('Bad Bunny'));
	expect(result.current.loading).toBe(true);
});

it('Returns artists on a successful artist fetch', async () => {
	mockFetch.mockResolvedValue(mockResponse(true, [MbBadBunny, MbDaftPunk]));
	const { result } = renderHook(() => useMusicBrainzArtistSearch('Bad Bunny'));
	await waitFor(() => expect(result.current.loading).toBe(false));

	expect(result.current.artists).toEqual([MbBadBunny, MbDaftPunk]);
	expect(result.current.error).toBeNull();
});

it('Returns an error when the artist fetch is not ok', async () => {
	mockFetch.mockResolvedValue(mockResponse(false));
	const { result } = renderHook(() => useMusicBrainzArtistSearch('Bad Bunny'));
	await waitFor(() => expect(result.current.loading).toBe(false));

	expect(result.current.error).toBe('MusicBrainz API error: 500');
	expect(result.current.artists).toBeNull();
});

// useMusicBrainzTrackSearch

it('Returns null tracks and not loading when track is null', () => {
	const { result } = renderHook(() => useMusicBrainzTrackSearch(null));
	expect(result.current.tracks).toBeNull();
	expect(result.current.loading).toBe(false);
	expect(mockFetch).not.toHaveBeenCalled();
});

it('Returns loading true while the track fetch is in flight', () => {
	mockFetch.mockReturnValue(new Promise(() => {}));
	const { result } = renderHook(() => useMusicBrainzTrackSearch('Basket Case'));
	expect(result.current.loading).toBe(true);
});

it('Returns tracks on a successful track fetch', async () => {
	mockFetch.mockResolvedValue(
		mockResponse(true, [MbBasketCase, MbFeelGoodInc]),
	);
	const { result } = renderHook(() => useMusicBrainzTrackSearch('Basket Case'));
	await waitFor(() => expect(result.current.loading).toBe(false));

	expect(result.current.tracks).toEqual([MbBasketCase, MbFeelGoodInc]);
	expect(result.current.error).toBeNull();
});

it('Returns an error when the track fetch is not ok', async () => {
	mockFetch.mockResolvedValue(mockResponse(false, undefined, 404));
	const { result } = renderHook(() => useMusicBrainzTrackSearch('Basket Case'));
	await waitFor(() => expect(result.current.loading).toBe(false));

	expect(result.current.error).toBe('MusicBrainz API error: 404');
	expect(result.current.tracks).toBeNull();
});
