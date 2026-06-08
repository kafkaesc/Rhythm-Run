import { renderHook } from '@testing-library/react';
import {
	SpotifyJVibesPlaylist,
	SpotifyNoCoverArtPlaylist,
} from '@/mocks/SpotifyPlaylistMocks';
import { useSpotifyEditablePlaylists } from './useSpotifyEditablePlaylists';

const mockUseSpotifyCurrentUser = jest.fn();
const mockUseSpotifyPlaylists = jest.fn();

jest.mock('./api/useSpotifyApi', () => ({
	useSpotifyCurrentUser: (...args: unknown[]) =>
		mockUseSpotifyCurrentUser(...args),
	useSpotifyPlaylists: (...args: unknown[]) => mockUseSpotifyPlaylists(...args),
}));

beforeEach(() => {
	mockUseSpotifyCurrentUser.mockReturnValue({
		user: { id: 'kafkaesc', display_name: 'Jared Hettinger' },
		loading: false,
		error: null,
	});
	mockUseSpotifyPlaylists.mockReturnValue({
		playlists: null,
		loading: false,
		error: null,
	});
});

it('Returns null playlists when playlists have not loaded', () => {
	const { result } = renderHook(() => useSpotifyEditablePlaylists());
	expect(result.current.playlists).toBeNull();
});

it('Returns loading true when playlists are loading', () => {
	mockUseSpotifyPlaylists.mockReturnValueOnce({
		playlists: null,
		loading: true,
	});
	const { result } = renderHook(() => useSpotifyEditablePlaylists());
	expect(result.current.loading).toBe(true);
});

it('Returns loading true when user is loading', () => {
	mockUseSpotifyCurrentUser.mockReturnValueOnce({
		user: null,
		loading: true,
		error: null,
	});
	const { result } = renderHook(() => useSpotifyEditablePlaylists());
	expect(result.current.loading).toBe(true);
});

it("Returns all user's playlists when user is null", () => {
	mockUseSpotifyCurrentUser.mockReturnValueOnce({
		user: null,
		loading: false,
		error: null,
	});
	mockUseSpotifyPlaylists.mockReturnValueOnce({
		playlists: [SpotifyJVibesPlaylist, SpotifyNoCoverArtPlaylist],
		loading: false,
	});
	const { result } = renderHook(() => useSpotifyEditablePlaylists());
	expect(result.current.playlists).toHaveLength(2);
});

it('Filters out playlists the user does not own or collaborate on', () => {
	mockUseSpotifyPlaylists.mockReturnValueOnce({
		loading: false,
		playlists: [
			SpotifyJVibesPlaylist,
			{
				...SpotifyNoCoverArtPlaylist,
				collaborative: false,
				owner: { display_name: 'Jane Doe', id: 'jane_doe' },
			},
		],
	});
	const { result } = renderHook(() => useSpotifyEditablePlaylists());
	expect(result.current.playlists).toHaveLength(1);
	expect(result.current.playlists![0].name).toBe('J-Vibes');
});

it('Returns the playlists error when the playlists fetch fails', () => {
	mockUseSpotifyPlaylists.mockReturnValueOnce({
		playlists: null,
		loading: false,
		error: 'Spotify API error: 500',
	});
	const { result } = renderHook(() => useSpotifyEditablePlaylists());
	expect(result.current.error).toBe('Spotify API error: 500');
});

it('Returns the user error when the user fetch fails', () => {
	mockUseSpotifyCurrentUser.mockReturnValueOnce({
		user: null,
		loading: false,
		error: 'Spotify API error: 401',
	});
	mockUseSpotifyPlaylists.mockReturnValueOnce({
		playlists: [],
		loading: false,
		error: null,
	});
	const { result } = renderHook(() => useSpotifyEditablePlaylists());
	expect(result.current.error).toBe('Spotify API error: 401');
});

it('Prioritizes the playlists error when both fetches fail', () => {
	mockUseSpotifyPlaylists.mockReturnValueOnce({
		playlists: null,
		loading: false,
		error: 'Spotify API error: 500',
	});
	mockUseSpotifyCurrentUser.mockReturnValueOnce({
		user: null,
		loading: false,
		error: 'Spotify API error: 401',
	});
	const { result } = renderHook(() => useSpotifyEditablePlaylists());
	expect(result.current.error).toBe('Spotify API error: 500');
});

it('Includes collaborative playlists the user does not own', () => {
	mockUseSpotifyPlaylists.mockReturnValueOnce({
		loading: false,
		playlists: [
			{
				...SpotifyNoCoverArtPlaylist,
				collaborative: true,
				owner: { display_name: 'Jane Doe', id: 'jane_doe' },
			},
		],
	});
	const { result } = renderHook(() => useSpotifyEditablePlaylists());
	expect(result.current.playlists).toHaveLength(1);
	expect(result.current.playlists![0].name).toBe('No Cover Art');
});
