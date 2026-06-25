import { renderHook } from '@testing-library/react';
import { SpBadBunny, SpDaftPunk, SpGreenDay } from '@/mocks/SpotifyArtistMocks';
import { useSpotifyRecentFavorites } from './useSpotifyRecentFavorites';

const mockUseSpotifyTopArtistsApi = jest.fn();

jest.mock('./api/useSpotifyApi', () => ({
	useSpotifyTopArtistsApi: (...args: unknown[]) =>
		mockUseSpotifyTopArtistsApi(...args),
}));

const THREE_ARTISTS = [SpBadBunny, SpDaftPunk, SpGreenDay];

beforeEach(() => {
	mockUseSpotifyTopArtistsApi.mockReturnValue({
		artists: THREE_ARTISTS,
		error: null,
		loading: false,
	});
});

it('Calls useSpotifyTopArtistsApi with a limit of 50 and recent true', () => {
	renderHook(() => useSpotifyRecentFavorites());
	expect(mockUseSpotifyTopArtistsApi).toHaveBeenCalledWith(50, true);
});

it('Passes through loading from the API', () => {
	mockUseSpotifyTopArtistsApi.mockReturnValueOnce({
		artists: null,
		error: null,
		loading: true,
	});
	const { result } = renderHook(() => useSpotifyRecentFavorites());
	expect(result.current.loading).toBe(true);
});

it('Passes through error from the API', () => {
	mockUseSpotifyTopArtistsApi.mockReturnValueOnce({
		artists: null,
		error: 'Spotify API error: 401',
		loading: false,
	});
	const { result } = renderHook(() => useSpotifyRecentFavorites());
	expect(result.current.error).toBe('Spotify API error: 401');
});

it('Returns the top n recent favorites in order', () => {
	const { result } = renderHook(() => useSpotifyRecentFavorites());
	expect(result.current.getSpotifyRecentFavorites(2)).toEqual([
		SpBadBunny,
		SpDaftPunk,
	]);
});

it('Returns 1 recent favorite by default', () => {
	const { result } = renderHook(() => useSpotifyRecentFavorites());
	expect(result.current.getSpotifyRecentFavorites()).toEqual([SpBadBunny]);
});

it('Returns the correct count of random recent favorites', () => {
	const { result } = renderHook(() => useSpotifyRecentFavorites());
	expect(result.current.getRandomSpotifyRecentFavorites(2)).toHaveLength(2);
});

it('Returns 1 random recent favorite by default', () => {
	const { result } = renderHook(() => useSpotifyRecentFavorites());
	expect(result.current.getRandomSpotifyRecentFavorites()).toHaveLength(1);
});

it('Returns an empty array when artists is null', () => {
	mockUseSpotifyTopArtistsApi.mockReturnValueOnce({
		artists: null,
		error: null,
		loading: false,
	});
	const { result } = renderHook(() => useSpotifyRecentFavorites());
	expect(result.current.getSpotifyRecentFavorites(3)).toEqual([]);
	expect(result.current.getRandomSpotifyRecentFavorites(3)).toEqual([]);
});
