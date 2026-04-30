import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MbArtistSearch from './MbArtistSearch';

const mockUseMusicBrainzArtistSearch = jest.fn();
mockUseMusicBrainzArtistSearch.mockReturnValue({
	artists: null,
	loading: null,
	error: null,
});

jest.mock('../hooks/api/useMusicBrainzApi', () => ({
	useMusicBrainzArtistSearch: (...args: unknown[]) =>
		mockUseMusicBrainzArtistSearch(...args),
}));

it('Renders the search input', () => {
	render(<MbArtistSearch />);
	const input = screen.getByRole('textbox');
	expect(input).toBeInTheDocument();
});

it('Renders the search button', () => {
	render(<MbArtistSearch />);
	// Must be an exact match to avoid the clear button being selected via "clear search"
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	expect(searchBtn).toBeInTheDocument();
});

it('Renders the clear button', () => {
	render(<MbArtistSearch />);
	const clearBtn = screen.getByRole('button', { name: /clear/i });
	expect(clearBtn).toBeInTheDocument();
});

it('Renders a disabled search button when input is empty', () => {
	render(<MbArtistSearch />);
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	expect(searchBtn).toBeDisabled();
});

it('Renders an enabled search button when input has text', async () => {
	render(<MbArtistSearch />);
	const input = screen.getByRole('textbox');
	await userEvent.type(input, 'Rilo Kiley');
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	expect(searchBtn).toBeEnabled();
});

it('Clears the input when clear button is clicked', async () => {
	render(<MbArtistSearch />);
	const input = screen.getByRole('textbox');
	await userEvent.type(input, 'Rilo Kiley');
	const clearBtn = screen.getByRole('button', { name: /clear/i });
	await userEvent.click(clearBtn);
	expect(input).toHaveValue('');
});

it('Renders loading status display when loading', () => {
	mockUseMusicBrainzArtistSearch.mockReturnValueOnce({
		artists: null,
		loading: true,
		error: null,
	});
	render(<MbArtistSearch />);
	const loadingDisplay = screen.getByText(/loading/i);
	expect(loadingDisplay).toBeInTheDocument();
});

it('Renders error status display when there is an error', () => {
	mockUseMusicBrainzArtistSearch.mockReturnValueOnce({
		artists: null,
		loading: null,
		error: 'Some error',
	});
	render(<MbArtistSearch />);
	const errDisplay = screen.getByText(/error with the musicbrainz response/i);
	expect(errDisplay).toBeInTheDocument();
});

it('Does not trigger a new search when the state is loading', async () => {
	mockUseMusicBrainzArtistSearch.mockReturnValue({
		artists: null,
		loading: true,
		error: null,
	});
	render(<MbArtistSearch />);
	const input = screen.getByRole('textbox');
	await userEvent.type(input, 'Rilo Kiley');
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	await userEvent.click(searchBtn);
	expect(mockUseMusicBrainzArtistSearch).not.toHaveBeenCalledWith('Rilo Kiley');
	mockUseMusicBrainzArtistSearch.mockReturnValue({
		artists: null,
		loading: null,
		error: null,
	});
});
