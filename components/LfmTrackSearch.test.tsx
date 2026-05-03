import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LfmTrackSearch from './LfmTrackSearch';

const mockUseLastFmTrackSearch = jest.fn();
mockUseLastFmTrackSearch.mockReturnValue({
	tracks: null,
	loading: null,
	error: null,
});

jest.mock('../hooks/api/useLastFmApi', () => ({
	useLastFmTrackSearch: (...args: unknown[]) =>
		mockUseLastFmTrackSearch(...args),
}));

it('Renders the search input', () => {
	render(<LfmTrackSearch />);
	const input = screen.getByRole('textbox');
	expect(input).toBeInTheDocument();
});

it('Renders the search button', () => {
	render(<LfmTrackSearch />);
	// Must be an exact match to avoid the clear button being selected via "clear search"
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	expect(searchBtn).toBeInTheDocument();
});

it('Renders the clear button', () => {
	render(<LfmTrackSearch />);
	const clearBtn = screen.getByRole('button', { name: /clear/i });
	expect(clearBtn).toBeInTheDocument();
});

it('Renders a disabled search button when input is empty', () => {
	render(<LfmTrackSearch />);
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	expect(searchBtn).toBeDisabled();
});

it('Renders an enabled search button when input has text', async () => {
	render(<LfmTrackSearch />);
	const input = screen.getByRole('textbox');
	await userEvent.type(input, 'Basket Case');
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	expect(searchBtn).toBeEnabled();
});

it('Clears the input when clear button is clicked', async () => {
	render(<LfmTrackSearch />);
	const input = screen.getByRole('textbox');
	await userEvent.type(input, 'Basket Case');
	const clearBtn = screen.getByRole('button', { name: /clear/i });
	await userEvent.click(clearBtn);
	expect(input).toHaveValue('');
});

it('Renders loading status display when loading', () => {
	mockUseLastFmTrackSearch.mockReturnValueOnce({
		tracks: null,
		loading: true,
		error: null,
	});
	render(<LfmTrackSearch />);
	const loadingDisplay = screen.getByText(/loading/i);
	expect(loadingDisplay).toBeInTheDocument();
});

it('Renders error status display when there is an error', () => {
	mockUseLastFmTrackSearch.mockReturnValueOnce({
		tracks: null,
		loading: null,
		error: 'Some error',
	});
	render(<LfmTrackSearch />);
	const errDisplay = screen.getByText(/error with the last\.fm response/i);
	expect(errDisplay).toBeInTheDocument();
});

it('Does not trigger a new search when the state is loading', async () => {
	mockUseLastFmTrackSearch.mockReturnValue({
		tracks: null,
		loading: true,
		error: null,
	});
	render(<LfmTrackSearch />);
	const input = screen.getByRole('textbox');
	await userEvent.type(input, 'Basket Case');
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	await userEvent.click(searchBtn);
	expect(mockUseLastFmTrackSearch).not.toHaveBeenCalledWith('Basket Case');
	mockUseLastFmTrackSearch.mockReturnValue({
		tracks: null,
		loading: null,
		error: null,
	});
});
