import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GsbTrackSearch from './GsbTrackSearch';

const mockUseGsbSongSearch = jest.fn();
mockUseGsbSongSearch.mockReturnValue({
	songs: null,
	loading: null,
	error: null,
});

jest.mock('../hooks/api/useGetSongBpmApi', () => ({
	useGsbSongSearch: (...args: unknown[]) => mockUseGsbSongSearch(...args),
}));

it('Renders the search input', () => {
	render(<GsbTrackSearch />);
	const input = screen.getByRole('textbox');
	expect(input).toBeInTheDocument();
});

it('Renders the search button', () => {
	render(<GsbTrackSearch />);
	// Must be an exact match to avoid the clear button being selected via "clear search"
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	expect(searchBtn).toBeInTheDocument();
});

it('Renders the clear button', () => {
	render(<GsbTrackSearch />);
	const clearBtn = screen.getByRole('button', { name: /clear/i });
	expect(clearBtn).toBeInTheDocument();
});

it('Renders a disabled search button when input is empty', () => {
	render(<GsbTrackSearch />);
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	expect(searchBtn).toBeDisabled();
});

it('Renders an enabled search button when input has text', async () => {
	render(<GsbTrackSearch />);
	const input = screen.getByRole('textbox');
	await userEvent.type(input, 'Basket Case');
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	expect(searchBtn).toBeEnabled();
});

it('Clears the input when clear button is clicked', async () => {
	render(<GsbTrackSearch />);
	const input = screen.getByRole('textbox');
	await userEvent.type(input, 'Basket Case');
	const clearBtn = screen.getByRole('button', { name: /clear/i });
	await userEvent.click(clearBtn);
	expect(input).toHaveValue('');
});

it('Renders loading status display when loading', () => {
	mockUseGsbSongSearch.mockReturnValueOnce({
		songs: null,
		loading: true,
		error: null,
	});
	render(<GsbTrackSearch />);
	const loadingDisplay = screen.getByText(/loading/i);
	expect(loadingDisplay).toBeInTheDocument();
});

it('Renders error status display when there is an error', () => {
	mockUseGsbSongSearch.mockReturnValueOnce({
		songs: null,
		loading: null,
		error: 'Some error',
	});
	render(<GsbTrackSearch />);
	const errDisplay = screen.getByText(/error with the getsongbpm response/i);
	expect(errDisplay).toBeInTheDocument();
});

it('Does not trigger a new search when the state is loading', async () => {
	mockUseGsbSongSearch.mockReturnValue({
		songs: null,
		loading: true,
		error: null,
	});
	render(<GsbTrackSearch />);
	const input = screen.getByRole('textbox');
	await userEvent.type(input, 'Basket Case');
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	await userEvent.click(searchBtn);
	expect(mockUseGsbSongSearch).not.toHaveBeenCalledWith('Basket Case');
	mockUseGsbSongSearch.mockReturnValue({
		songs: null,
		loading: null,
		error: null,
	});
});
