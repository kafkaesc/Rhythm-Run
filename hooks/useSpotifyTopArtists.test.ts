import { renderHook } from '@testing-library/react';
import { SpBadBunny, SpDaftPunk, SpGreenDay } from '@/mocks/SpotifyArtistMocks';
import { useSpotifyTopArtists } from './useSpotifyTopArtists';

const mockUseSpotifyTopArtistsApi = jest.fn();

jest.mock('./api/useSpotifyApi', () => ({
	useSpotifyTopArtistsApi: (...args: unknown[]) =>
		mockUseSpotifyTopArtistsApi(...args),
}));

const THREE_ARTISTS = [SpBadBunny, SpDaftPunk, SpGreenDay];

beforeEach(() => {
	mockUseSpotifyTopArtistsApi.mockReturnValue({
		artists: THREE_ARTISTS,
		loading: false,
		error: null,
	});
});

it('Calls useSpotifyTopArtistsApi with a limit of 50', () => {
	renderHook(() => useSpotifyTopArtists());
	expect(mockUseSpotifyTopArtistsApi).toHaveBeenCalledWith(50);
});

it('Passes through artists from the API', () => {
	const { result } = renderHook(() => useSpotifyTopArtists());
	expect(result.current.artists).toBe(THREE_ARTISTS);
});

it('Passes through loading from the API', () => {
	mockUseSpotifyTopArtistsApi.mockReturnValueOnce({
		artists: null,
		loading: true,
		error: null,
	});
	const { result } = renderHook(() => useSpotifyTopArtists());
	expect(result.current.loading).toBe(true);
});

it('Passes through error from the API', () => {
	mockUseSpotifyTopArtistsApi.mockReturnValueOnce({
		artists: null,
		loading: false,
		error: 'Spotify API error: 401',
	});
	const { result } = renderHook(() => useSpotifyTopArtists());
	expect(result.current.error).toBe('Spotify API error: 401');
});

it('Returns the top n artists in order via getSpotifyTopArtists', () => {
	const { result } = renderHook(() => useSpotifyTopArtists());
	expect(result.current.getSpotifyTopArtists(2)).toEqual([
		SpBadBunny,
		SpDaftPunk,
	]);
});

it('Returns 1 artist by default via getSpotifyTopArtists', () => {
	const { result } = renderHook(() => useSpotifyTopArtists());
	expect(result.current.getSpotifyTopArtists()).toEqual([SpBadBunny]);
});

it('Returns the correct count via getRandomSpotifyTopArtists', () => {
	const { result } = renderHook(() => useSpotifyTopArtists());
	expect(result.current.getRandomSpotifyTopArtists(2)).toHaveLength(2);
});

it('Returns 1 artist by default via getRandomSpotifyTopArtists', () => {
	const { result } = renderHook(() => useSpotifyTopArtists());
	expect(result.current.getRandomSpotifyTopArtists()).toHaveLength(1);
});

it('Returns an empty array when artists is null', () => {
	mockUseSpotifyTopArtistsApi.mockReturnValueOnce({
		artists: null,
		loading: false,
		error: null,
	});
	const { result } = renderHook(() => useSpotifyTopArtists());
	expect(result.current.getSpotifyTopArtists(3)).toEqual([]);
	expect(result.current.getRandomSpotifyTopArtists(3)).toEqual([]);
});
