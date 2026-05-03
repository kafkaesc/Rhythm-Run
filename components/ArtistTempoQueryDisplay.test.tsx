import { render, screen } from '@testing-library/react';
import ArtistTempoQueryDisplay from './ArtistTempoQueryDisplay';
import { MbDaftPunk, MbGreenDay } from '@/mocks/MbArtistMocks';

it('Renders ____ for tempo when tempo is not provided', () => {
	render(<ArtistTempoQueryDisplay />);
	const p = screen.getByText(/____.*tempo/i);
	expect(p).toBeInTheDocument();
});

it('Renders ____ for artists when artists is not provided', () => {
	render(<ArtistTempoQueryDisplay />);
	const p = screen.getByText(/from ____/i);
	expect(p).toBeInTheDocument();
});

it('Renders ____ for artists when artists is an empty array', () => {
	render(<ArtistTempoQueryDisplay artists={[]} />);
	const p = screen.getByText(/from ____/i);
	expect(p).toBeInTheDocument();
});

it('Renders the tempo when provided', () => {
	render(<ArtistTempoQueryDisplay tempo={120} />);
	const p = screen.getByText(/120.*tempo/i);
	expect(p).toBeInTheDocument();
});

it('Renders a single artist name when provided', () => {
	render(<ArtistTempoQueryDisplay artists={[MbGreenDay]} />);
	const p = screen.getByText(/Green Day/i);
	expect(p).toBeInTheDocument();
});

it('Renders multiple artist names joined by a comma', () => {
	render(<ArtistTempoQueryDisplay artists={[MbGreenDay, MbDaftPunk]} />);
	const p = screen.getByText(/Green Day, Daft Punk/i);
	expect(p).toBeInTheDocument();
});

it('Does not render epsilon text when epsilon is not provided', () => {
	render(<ArtistTempoQueryDisplay tempo={120} />);
	const p = screen.queryByText(/give or take/i);
	expect(p).not.toBeInTheDocument();
});

it('Renders epsilon text when epsilon is provided', () => {
	render(<ArtistTempoQueryDisplay tempo={120} epsilon={10} />);
	const p = screen.getByText(/give or take 10 bpm/i);
	expect(p).toBeInTheDocument();
});
