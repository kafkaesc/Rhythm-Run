import { renderHook, waitFor } from '@testing-library/react';
import { GsbBadBunny, GsbDaftPunk } from '@/mocks/GsbArtistMocks';
import { GsbBasketCase, GsbFeelGoodInc } from '@/mocks/GsbTrackMocks';
import { GsbTempo } from '@/models/getSongBpm';
import {
	useGsbArtistSearch,
	useGsbTempoSearch,
	useGsbTrackSearch,
} from './useGetSongBpmApi';

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

const GsbAroundTheWorld: GsbTempo = {
	album: [],
	artist: [GsbDaftPunk],
	song_id: 'j2PvW',
	song_title: 'Around the World',
	song_uri: 'https://getsongbpm.com/song/around-the-world/j2PvW',
	tempo: 122,
};

// useGsbArtistSearch

it('Returns null artists and not loading when artist is null', () => {
	const { result } = renderHook(() => useGsbArtistSearch(null));
	expect(result.current.artists).toBeNull();
	expect(result.current.loading).toBe(false);
	expect(mockFetch).not.toHaveBeenCalled();
});

it('Returns loading true while the artist fetch is in progress', () => {
	mockFetch.mockReturnValue(new Promise(() => {}));
	const { result } = renderHook(() => useGsbArtistSearch('Bad Bunny'));
	expect(result.current.loading).toBe(true);
});

it('Returns artists on a successful artist fetch', async () => {
	mockFetch.mockResolvedValue(mockResponse(true, [GsbBadBunny, GsbDaftPunk]));
	const { result } = renderHook(() => useGsbArtistSearch('Bad Bunny'));
	await waitFor(() => expect(result.current.loading).toBe(false));

	expect(result.current.artists).toEqual([GsbBadBunny, GsbDaftPunk]);
	expect(result.current.error).toBeNull();
});

it('Returns an error when the artist fetch is not ok', async () => {
	mockFetch.mockResolvedValue(mockResponse(false));
	const { result } = renderHook(() => useGsbArtistSearch('Bad Bunny'));
	await waitFor(() => expect(result.current.loading).toBe(false));

	expect(result.current.error).toBe('GetSongBPM API error: 500');
	expect(result.current.artists).toBeNull();
});

it('Returns an Unknown error when the fetch rejects with a non-Error', async () => {
	mockFetch.mockRejectedValue('network blip');
	const { result } = renderHook(() => useGsbArtistSearch('Bad Bunny'));
	await waitFor(() => expect(result.current.error).toBe('Unknown error'));

	expect(result.current.artists).toBeNull();
});

// useGsbTrackSearch

it('Returns null tracks and not loading when track is null', () => {
	const { result } = renderHook(() => useGsbTrackSearch(null));
	expect(result.current.tracks).toBeNull();
	expect(result.current.loading).toBe(false);
	expect(mockFetch).not.toHaveBeenCalled();
});

it('Returns loading true while the track fetch is in flight', () => {
	mockFetch.mockReturnValue(new Promise(() => {}));
	const { result } = renderHook(() => useGsbTrackSearch('Basket Case'));
	expect(result.current.loading).toBe(true);
});

it('Returns tracks on a successful track fetch', async () => {
	mockFetch.mockResolvedValue(
		mockResponse(true, [GsbBasketCase, GsbFeelGoodInc]),
	);
	const { result } = renderHook(() => useGsbTrackSearch('Basket Case'));
	await waitFor(() => expect(result.current.loading).toBe(false));

	expect(result.current.tracks).toEqual([GsbBasketCase, GsbFeelGoodInc]);
	expect(result.current.error).toBeNull();
});

it('Returns an error when the track fetch is not ok', async () => {
	mockFetch.mockResolvedValue(mockResponse(false, undefined, 404));
	const { result } = renderHook(() => useGsbTrackSearch('Basket Case'));
	await waitFor(() => expect(result.current.loading).toBe(false));

	expect(result.current.error).toBe('GetSongBPM API error: 404');
	expect(result.current.tracks).toBeNull();
});

// useGsbTempoSearch

it('Returns null tracks and not loading when bpm is null', () => {
	const { result } = renderHook(() => useGsbTempoSearch(null));
	expect(result.current.tracks).toBeNull();
	expect(result.current.loading).toBe(false);
	expect(mockFetch).not.toHaveBeenCalled();
});

it('Returns loading true while the tempo fetch is in flight', () => {
	mockFetch.mockReturnValue(new Promise(() => {}));
	const { result } = renderHook(() => useGsbTempoSearch(122));
	expect(result.current.loading).toBe(true);
});

it('Returns tracks on a successful tempo fetch', async () => {
	mockFetch.mockResolvedValue(mockResponse(true, [GsbAroundTheWorld]));
	const { result } = renderHook(() => useGsbTempoSearch(122));
	await waitFor(() => expect(result.current.loading).toBe(false));

	expect(result.current.tracks).toEqual([GsbAroundTheWorld]);
	expect(result.current.error).toBeNull();
});

it('Returns an error when the tempo fetch is not ok', async () => {
	mockFetch.mockResolvedValue(mockResponse(false));
	const { result } = renderHook(() => useGsbTempoSearch(122));
	await waitFor(() => expect(result.current.loading).toBe(false));

	expect(result.current.error).toBe('GetSongBPM API error: 500');
	expect(result.current.tracks).toBeNull();
});
