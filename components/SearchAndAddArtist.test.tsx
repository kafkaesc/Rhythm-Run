import { render, screen } from '@testing-library/react';
import SearchAndAddArtist from './SearchAndAddArtist';

jest.mock('../hooks/useSpotifyApi', () => ({
	useSpotifyArtistSearch: () => ({ artists: null, loading: null, error: null }),
}));

it('Renders the default title', () => {
	render(<SearchAndAddArtist />);
	const title = screen.getByRole('heading', { name: /search and add artists/i, level: 2 });
	expect(title).toBeInTheDocument();
});

it('Renders a custom title', () => {
	render(<SearchAndAddArtist title="My Artists" />);
	const title = screen.getByRole('heading', { name: /my artists/i, level: 2 });
	expect(title).toBeInTheDocument();
});

it('Renders the searched options heading', () => {
	render(<SearchAndAddArtist />);
	const heading = screen.getByRole('heading', { name: /searched options/i });
	expect(heading).toBeInTheDocument();
});

it('Renders the selected heading', () => {
	render(<SearchAndAddArtist />);
	const heading = screen.getByRole('heading', { name: /selected/i });
	expect(heading).toBeInTheDocument();
});

it('Renders the search input', () => {
	render(<SearchAndAddArtist />);
	const input = screen.getByRole('textbox');
	expect(input).toBeInTheDocument();
});
