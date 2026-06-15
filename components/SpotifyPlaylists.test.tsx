import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SpotifyJVibesPlaylist } from '@/mocks/SpotifyPlaylistMocks';
import SpotifyPlaylists from './SpotifyPlaylists';

const mockUseSpotifyEditablePlaylists = jest.fn();
mockUseSpotifyEditablePlaylists.mockReturnValue({ playlists: null, loading: false, error: null });

jest.mock('../hooks/useSpotifyEditablePlaylists', () => ({
	useSpotifyEditablePlaylists: (...args: unknown[]) =>
		mockUseSpotifyEditablePlaylists(...args),
}));

it('Renders nothing when loading', () => {
	mockUseSpotifyEditablePlaylists.mockReturnValueOnce({
		loading: true,
		playlists: null,
	});
	const { container } = render(<SpotifyPlaylists />);
	expect(container).toBeEmptyDOMElement();
});

it('Renders nothing when playlists is null', () => {
	const { container } = render(<SpotifyPlaylists />);
	expect(container).toBeEmptyDOMElement();
});

it('Renders playlist names', () => {
	mockUseSpotifyEditablePlaylists.mockReturnValueOnce({
		playlists: [SpotifyJVibesPlaylist],
		loading: false,
	});
	render(<SpotifyPlaylists />);
	const name = screen.getByText('J-Vibes');
	expect(name).toBeInTheDocument();
});

it('Renders playlists as links when selectPlaylist is not provided', () => {
	mockUseSpotifyEditablePlaylists.mockReturnValueOnce({
		loading: false,
		playlists: [SpotifyJVibesPlaylist],
	});
	render(<SpotifyPlaylists />);
	const link = screen.getByRole('link');
	expect(link).toBeInTheDocument();
	expect(link).toHaveTextContent(/j-vibes/i);
});

it('Renders playlists as buttons when selectPlaylist is provided', () => {
	mockUseSpotifyEditablePlaylists.mockReturnValueOnce({
		loading: false,
		playlists: [SpotifyJVibesPlaylist],
	});
	render(<SpotifyPlaylists selectPlaylist={jest.fn()} />);
	const btn = screen.getByRole('button');
	expect(btn).toBeInTheDocument();
	expect(btn).toHaveTextContent(/j-vibes/i);
});

it('Calls selectPlaylist with the playlist when a button is clicked', async () => {
	mockUseSpotifyEditablePlaylists.mockReturnValueOnce({
		loading: false,
		playlists: [SpotifyJVibesPlaylist],
	});
	const selectPlaylist = jest.fn();
	render(<SpotifyPlaylists selectPlaylist={selectPlaylist} />);
	const btn = screen.getByRole('button');
	await userEvent.click(btn);
	expect(selectPlaylist).toHaveBeenCalledWith(SpotifyJVibesPlaylist);
});
