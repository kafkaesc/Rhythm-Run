import { render, screen } from '@testing-library/react';
import SearchAndAddTrack from './SearchAndAddTrack';

jest.mock('../hooks/useSpotifyApi', () => ({
	useSpotifyTrackSearch: () => ({ tracks: null, loading: null, error: null }),
}));

it('Renders the default title', () => {
	render(<SearchAndAddTrack />);
	const title = screen.getByRole('heading', {
		name: /search and add tracks/i,
		level: 2,
	});
	expect(title).toBeInTheDocument();
});

it('Renders a custom title', () => {
	render(<SearchAndAddTrack title="My Tracks" />);
	const title = screen.getByRole('heading', { name: /my tracks/i, level: 2 });
	expect(title).toBeInTheDocument();
});

it('Renders the searched options heading', () => {
	render(<SearchAndAddTrack />);
	const heading = screen.getByRole('heading', { name: /searched options/i });
	expect(heading).toBeInTheDocument();
});

it('Renders the selected heading', () => {
	render(<SearchAndAddTrack />);
	const heading = screen.getByRole('heading', { name: /selected/i });
	expect(heading).toBeInTheDocument();
});

it('Renders the search input', () => {
	render(<SearchAndAddTrack />);
	const input = screen.getByRole('textbox');
	expect(input).toBeInTheDocument();
});
