import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SpotifyTrackSearch from './SpotifyTrackSearch';

const mockUseSpotifyTrackSearch = jest.fn();
mockUseSpotifyTrackSearch.mockReturnValue({
	tracks: null,
	loading: null,
	error: null,
});

jest.mock('../hooks/useSpotifyApi', () => ({
	useSpotifyTrackSearch: (...args: unknown[]) =>
		mockUseSpotifyTrackSearch(...args),
}));

it('Renders the search input', () => {
	render(<SpotifyTrackSearch />);
	const input = screen.getByRole('textbox');
	expect(input).toBeInTheDocument();
});

it('Renders the search button', () => {
	render(<SpotifyTrackSearch />);
	// Must be an exact match to avoid the clear button being selected via "clear search"
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	expect(searchBtn).toBeInTheDocument();
});

it('Renders the clear button', () => {
	render(<SpotifyTrackSearch />);
	const clearBtn = screen.getByRole('button', { name: /clear/i });
	expect(clearBtn).toBeInTheDocument();
});

it('Renders a disabled search button when input is empty', () => {
	render(<SpotifyTrackSearch />);
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	expect(searchBtn).toBeDisabled();
});

it('Renders an enabled search button when input has text', async () => {
	render(<SpotifyTrackSearch />);
	const input = screen.getByRole('textbox');
	await userEvent.type(input, 'Basket Case');
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	expect(searchBtn).toBeEnabled();
});

it('Clears the input when clear button is clicked', async () => {
	render(<SpotifyTrackSearch />);
	const input = screen.getByRole('textbox');
	await userEvent.type(input, 'Basket Case');
	const clearBtn = screen.getByRole('button', { name: /clear/i });
	await userEvent.click(clearBtn);
	expect(input).toHaveValue('');
});

it('Renders loading status display when loading', () => {
	mockUseSpotifyTrackSearch.mockReturnValueOnce({
		tracks: null,
		loading: true,
		error: null,
	});
	render(<SpotifyTrackSearch />);
	const loadingDisplay = screen.getByText(/loading/i);
	expect(loadingDisplay).toBeInTheDocument();
});

it('Renders error status display when there is an error', () => {
	mockUseSpotifyTrackSearch.mockReturnValueOnce({
		tracks: null,
		loading: null,
		error: 'Some error',
	});
	render(<SpotifyTrackSearch />);
	const errDisplay = screen.getByText(/error with the spotify response/i);
	expect(errDisplay).toBeInTheDocument();
});
