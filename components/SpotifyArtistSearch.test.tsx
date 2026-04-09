import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SpotifyArtistSearch from './SpotifyArtistSearch';

const mockUseSpotifyArtistSearch = jest.fn();
mockUseSpotifyArtistSearch.mockReturnValue({
	artists: null,
	loading: null,
	error: null,
});

jest.mock('../hooks/useSpotifyApi', () => ({
	useSpotifyArtistSearch: (...args: unknown[]) =>
		mockUseSpotifyArtistSearch(...args),
}));

it('Renders the search input', () => {
	render(<SpotifyArtistSearch />);
	const input = screen.getByRole('textbox');
	expect(input).toBeInTheDocument();
});

it('Renders the search button', () => {
	render(<SpotifyArtistSearch />);
	// Must be an exact match to avoid the clear button being selected via "clear search"
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	expect(searchBtn).toBeInTheDocument();
});

it('Renders the clear button', () => {
	render(<SpotifyArtistSearch />);
	const clearBtn = screen.getByRole('button', { name: /clear/i });
	expect(clearBtn).toBeInTheDocument();
});

it('Renders a disabled search button when input is empty', () => {
	render(<SpotifyArtistSearch />);
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	expect(searchBtn).toBeDisabled();
});

it('Renders an enabled search button when input has text', async () => {
	render(<SpotifyArtistSearch />);
	const input = screen.getByRole('textbox');
	await userEvent.type(input, 'Rilo Kiley');
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	expect(searchBtn).toBeEnabled();
});

it('Clears the input when clear button is clicked', async () => {
	render(<SpotifyArtistSearch />);
	const input = screen.getByRole('textbox');
	await userEvent.type(input, 'Rilo Kiley');
	const clearBtn = screen.getByRole('button', { name: /clear/i });
	await userEvent.click(clearBtn);
	expect(input).toHaveValue('');
});

it('Renders loading status display when loading', () => {
	mockUseSpotifyArtistSearch.mockReturnValueOnce({
		artists: null,
		loading: true,
		error: null,
	});
	render(<SpotifyArtistSearch />);
	const loadingDisplay = screen.getByText(/loading/i);
	expect(loadingDisplay).toBeInTheDocument();
});

it('Renders error status display when there is an error', () => {
	mockUseSpotifyArtistSearch.mockReturnValueOnce({
		artists: null,
		loading: null,
		error: 'Some error',
	});
	render(<SpotifyArtistSearch />);
	const errDisplay = screen.getByText(/error with the spotify response/i);
	expect(errDisplay).toBeInTheDocument();
});
