import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MbTrackSearch from './MbTrackSearch';

const mockUseMusicBrainzTrackSearch = jest.fn();
mockUseMusicBrainzTrackSearch.mockReturnValue({
	tracks: null,
	loading: null,
	error: null,
});

jest.mock('../hooks/api/useMusicBrainzApi', () => ({
	useMusicBrainzTrackSearch: (...args: unknown[]) =>
		mockUseMusicBrainzTrackSearch(...args),
}));

it('Renders the search input', () => {
	render(<MbTrackSearch />);
	const input = screen.getByRole('textbox');
	expect(input).toBeInTheDocument();
});

it('Renders the search button', () => {
	render(<MbTrackSearch />);
	// Must be an exact match to avoid the clear button being selected via "clear search"
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	expect(searchBtn).toBeInTheDocument();
});

it('Renders the clear button', () => {
	render(<MbTrackSearch />);
	const clearBtn = screen.getByRole('button', { name: /clear/i });
	expect(clearBtn).toBeInTheDocument();
});

it('Renders a disabled search button when input is empty', () => {
	render(<MbTrackSearch />);
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	expect(searchBtn).toBeDisabled();
});

it('Renders an enabled search button when input has text', async () => {
	render(<MbTrackSearch />);
	const input = screen.getByRole('textbox');
	await userEvent.type(input, 'Basket Case');
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	expect(searchBtn).toBeEnabled();
});

it('Clears the input when clear button is clicked', async () => {
	render(<MbTrackSearch />);
	const input = screen.getByRole('textbox');
	await userEvent.type(input, 'Basket Case');
	const clearBtn = screen.getByRole('button', { name: /clear/i });
	await userEvent.click(clearBtn);
	expect(input).toHaveValue('');
});

it('Renders loading status display when loading', () => {
	mockUseMusicBrainzTrackSearch.mockReturnValueOnce({
		tracks: null,
		loading: true,
		error: null,
	});
	render(<MbTrackSearch />);
	const loadingDisplay = screen.getByText(/loading/i);
	expect(loadingDisplay).toBeInTheDocument();
});

it('Renders error status display when there is an error', () => {
	mockUseMusicBrainzTrackSearch.mockReturnValueOnce({
		tracks: null,
		loading: null,
		error: 'Some error',
	});
	render(<MbTrackSearch />);
	const errDisplay = screen.getByText(/error with the musicbrainz response/i);
	expect(errDisplay).toBeInTheDocument();
});

it('Does not trigger a new search when the state is loading', async () => {
	mockUseMusicBrainzTrackSearch.mockReturnValue({
		tracks: null,
		loading: true,
		error: null,
	});
	render(<MbTrackSearch />);
	const input = screen.getByRole('textbox');
	await userEvent.type(input, 'Basket Case');
	const searchBtn = screen.getByRole('button', { name: /^search$/i });
	await userEvent.click(searchBtn);
	expect(mockUseMusicBrainzTrackSearch).not.toHaveBeenCalledWith('Basket Case');
	mockUseMusicBrainzTrackSearch.mockReturnValue({
		tracks: null,
		loading: null,
		error: null,
	});
});
