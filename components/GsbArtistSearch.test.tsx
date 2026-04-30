import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GsbArtistSearch from './GsbArtistSearch';

const mockUseGsbArtistSearch = jest.fn();
mockUseGsbArtistSearch.mockReturnValue({
	artists: null,
	loading: null,
	error: null,
});

jest.mock('../hooks/useGetSongBpmApi', () => ({
	useGsbArtistSearch: (...args: unknown[]) => mockUseGsbArtistSearch(...args),
}));

it('Renders the search input', () => {
	render(<GsbArtistSearch />);
	const input = screen.getByRole('textbox');
	expect(input).toBeInTheDocument();
});

it('Renders the search button', () => {
	render(<GsbArtistSearch />);
	// Must be an exact match to avoid the clear button being selected via "clear search"
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	expect(searchBtn).toBeInTheDocument();
});

it('Renders the clear button', () => {
	render(<GsbArtistSearch />);
	const clearBtn = screen.getByRole('button', { name: /clear/i });
	expect(clearBtn).toBeInTheDocument();
});

it('Renders a disabled search button when input is empty', () => {
	render(<GsbArtistSearch />);
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	expect(searchBtn).toBeDisabled();
});

it('Renders an enabled search button when input has text', async () => {
	render(<GsbArtistSearch />);
	const input = screen.getByRole('textbox');
	await userEvent.type(input, 'Rilo Kiley');
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	expect(searchBtn).toBeEnabled();
});

it('Clears the input when clear button is clicked', async () => {
	render(<GsbArtistSearch />);
	const input = screen.getByRole('textbox');
	await userEvent.type(input, 'Rilo Kiley');
	const clearBtn = screen.getByRole('button', { name: /clear/i });
	await userEvent.click(clearBtn);
	expect(input).toHaveValue('');
});

it('Renders loading status display when loading', () => {
	mockUseGsbArtistSearch.mockReturnValueOnce({
		artists: null,
		loading: true,
		error: null,
	});
	render(<GsbArtistSearch />);
	const loadingDisplay = screen.getByText(/loading/i);
	expect(loadingDisplay).toBeInTheDocument();
});

it('Renders error status display when there is an error', () => {
	mockUseGsbArtistSearch.mockReturnValueOnce({
		artists: null,
		loading: null,
		error: 'Some error',
	});
	render(<GsbArtistSearch />);
	const errDisplay = screen.getByText(/error with the getsongbpm response/i);
	expect(errDisplay).toBeInTheDocument();
});

it('Does not trigger a new search when the state is loading', async () => {
	mockUseGsbArtistSearch.mockReturnValue({
		artists: null,
		loading: true,
		error: null,
	});
	render(<GsbArtistSearch />);
	const input = screen.getByRole('textbox');
	await userEvent.type(input, 'Rilo Kiley');
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	await userEvent.click(searchBtn);
	expect(mockUseGsbArtistSearch).not.toHaveBeenCalledWith('Rilo Kiley');
	mockUseGsbArtistSearch.mockReturnValue({
		artists: null,
		loading: null,
		error: null,
	});
});
