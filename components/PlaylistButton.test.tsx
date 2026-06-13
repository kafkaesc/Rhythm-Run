import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
	SpotifyJVibesPlaylist,
	SpotifyNoCoverArtPlaylist,
} from '@/mocks/SpotifyPlaylistMocks';
import PlaylistButton from './PlaylistButton';

it('Renders the playlist name', () => {
	render(<PlaylistButton playlist={SpotifyJVibesPlaylist} />);
	const name = screen.getByText('J-Vibes');
	expect(name).toBeInTheDocument();
});

it('Renders as a button when href is not provided', () => {
	render(<PlaylistButton playlist={SpotifyJVibesPlaylist} />);
	const btn = screen.getByRole('button');
	expect(btn).toBeInTheDocument();
	expect(btn).toHaveTextContent(/j-vibes/i);
});

it('Renders as a link when href is provided', () => {
	render(
		<PlaylistButton
			href={SpotifyJVibesPlaylist.external_urls.spotify}
			playlist={SpotifyJVibesPlaylist}
		/>,
	);
	const link = screen.getByRole('link');
	expect(link).toBeInTheDocument();
	expect(link).toHaveTextContent(/j-vibes/i);
});

it('Link has the correct href', () => {
	render(
		<PlaylistButton
			href={SpotifyJVibesPlaylist.external_urls.spotify}
			playlist={SpotifyJVibesPlaylist}
		/>,
	);
	const link = screen.getByRole('link');
	expect(link).toHaveAttribute(
		'href',
		SpotifyJVibesPlaylist.external_urls.spotify,
	);
});

it('Link opens in new window', () => {
	render(
		<PlaylistButton
			href={SpotifyJVibesPlaylist.external_urls.spotify}
			playlist={SpotifyJVibesPlaylist}
		/>,
	);
	const link = screen.getByRole('link');
	expect(link).toHaveAttribute('rel', 'noopener noreferrer');
	expect(link).toHaveAttribute('target', '_blank');
});

it('Renders cover art when images are available', () => {
	render(<PlaylistButton playlist={SpotifyJVibesPlaylist} />);
	const img = screen.getByRole('img', { name: /j-vibes cover/i });
	expect(img).toBeInTheDocument();
});

it('Does not try to render cover art when no images are provided', () => {
	render(<PlaylistButton playlist={SpotifyNoCoverArtPlaylist} />);
	const img = screen.queryByRole('img');
	expect(img).not.toBeInTheDocument();
});

it('Calls onClick when the button is clicked', async () => {
	const onClick = jest.fn();
	render(<PlaylistButton onClick={onClick} playlist={SpotifyJVibesPlaylist} />);
	const btn = screen.getByRole('button');
	await userEvent.click(btn);
	expect(onClick).toHaveBeenCalledTimes(1);
});
