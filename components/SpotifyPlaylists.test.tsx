import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
	SpotifyJVibesPlaylist,
	SpotifyNoCoverArtPlaylist,
} from '@/mocks/SpotifyPlaylistMocks';
import SpotifyPlaylists from './SpotifyPlaylists';

const mockUseSpotifyPlaylists = jest.fn();
mockUseSpotifyPlaylists.mockReturnValue({
	playlists: null,
	loading: false,
});

jest.mock('../hooks/api/useSpotifyApi', () => ({
	useSpotifyPlaylists: (...args: unknown[]) => mockUseSpotifyPlaylists(...args),
}));

it('Renders nothing when loading', () => {
	mockUseSpotifyPlaylists.mockReturnValueOnce({
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
	mockUseSpotifyPlaylists.mockReturnValueOnce({
		playlists: [SpotifyJVibesPlaylist, SpotifyNoCoverArtPlaylist],
		loading: false,
	});
	render(<SpotifyPlaylists />);
	const jVibes = screen.getByText('J-Vibes');
	const noCoverArt = screen.getByText('No Cover Art');
	expect(jVibes).toBeInTheDocument();
	expect(noCoverArt).toBeInTheDocument();
});

it('Renders playlists as links when selectPlaylist is not provided', () => {
	mockUseSpotifyPlaylists.mockReturnValueOnce({
		loading: false,
		playlists: [SpotifyJVibesPlaylist],
	});
	render(<SpotifyPlaylists />);
	const link = screen.getByRole('link');
	expect(link).toBeInTheDocument();
	expect(link).toHaveTextContent(/j-vibes/i);
});

it('Renders playlists as buttons when selectPlaylist is provided', () => {
	mockUseSpotifyPlaylists.mockReturnValueOnce({
		loading: false,
		playlists: [SpotifyJVibesPlaylist],
	});
	render(<SpotifyPlaylists selectPlaylist={jest.fn()} />);
	const btn = screen.getByRole('button');
	expect(btn).toBeInTheDocument();
	expect(btn).toHaveTextContent(/j-vibes/i);
});

it('Calls selectPlaylist with the playlist when a button is clicked', async () => {
	mockUseSpotifyPlaylists.mockReturnValueOnce({
		loading: false,
		playlists: [SpotifyJVibesPlaylist],
	});
	const selectPlaylist = jest.fn();
	render(<SpotifyPlaylists selectPlaylist={selectPlaylist} />);
	const btn = screen.getByRole('button');
	await userEvent.click(btn);
	expect(selectPlaylist).toHaveBeenCalledWith(SpotifyJVibesPlaylist);
});
