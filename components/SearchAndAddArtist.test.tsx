import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchAndAddArtist from './SearchAndAddArtist';
import { SpBadBunny } from '@/mocks/SpotifyArtistMocks';

const mockUseSpotifyArtistSearch = jest.fn();
mockUseSpotifyArtistSearch.mockReturnValue({
	artists: null,
	loading: null,
	error: null,
});

jest.mock('../hooks/api/useSpotifyApi', () => ({
	useSpotifyArtistSearch: (...args: unknown[]) =>
		mockUseSpotifyArtistSearch(...args),
}));

it('Renders the default title', () => {
	render(<SearchAndAddArtist />);
	const title = screen.getByRole('heading', {
		name: /search and add artists/i,
		level: 2,
	});
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

it('Adds an artist to the selected list when the add button is clicked', async () => {
	mockUseSpotifyArtistSearch.mockReturnValueOnce({
		artists: [SpBadBunny],
		loading: false,
		error: null,
	});
	render(<SearchAndAddArtist />);
	const addBadBunny = screen.getByRole('button', { name: /Add Bad Bunny/i });
	await userEvent.click(addBadBunny);
	const rmBadBunny = screen.getByRole('button', { name: /Remove Bad Bunny/i });
	expect(rmBadBunny).toBeInTheDocument();
});

it('Does not add a duplicate artist', async () => {
	mockUseSpotifyArtistSearch.mockReturnValue({
		artists: [SpBadBunny],
		loading: false,
		error: null,
	});
	render(<SearchAndAddArtist />);
	const addBadBunny = screen.getByRole('button', { name: /Add Bad Bunny/i });
	await userEvent.click(addBadBunny);
	await userEvent.click(addBadBunny);
	const rmButtons = screen.getAllByRole('button', {
		name: /Remove Bad Bunny/i,
	});
	expect(rmButtons).toHaveLength(1);
	mockUseSpotifyArtistSearch.mockReturnValue({
		artists: null,
		loading: null,
		error: null,
	});
});

it('Removes an artist from the selected list when the remove button is clicked', async () => {
	mockUseSpotifyArtistSearch.mockReturnValueOnce({
		artists: [SpBadBunny],
		loading: false,
		error: null,
	});
	render(<SearchAndAddArtist />);
	const addBadBunny = screen.getByRole('button', { name: /Add Bad Bunny/i });
	await userEvent.click(addBadBunny);
	const rmBadBunny = screen.getByRole('button', { name: /Remove Bad Bunny/i });
	await userEvent.click(rmBadBunny);
	const rmBadBunnyAfter = screen.queryByRole('button', {
		name: /Remove Bad Bunny/i,
	});
	expect(rmBadBunnyAfter).not.toBeInTheDocument();
});
