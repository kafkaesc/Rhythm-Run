import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchAndAddTrack from './SearchAndAddTrack';
import { SpBasketCase } from '@/mocks/SpotifyTrackMocks';

const mockUseSpotifyTrackSearch = jest.fn();
mockUseSpotifyTrackSearch.mockReturnValue({
	tracks: null,
	loading: null,
	error: null,
});

jest.mock('../hooks/api/useSpotifyApi', () => ({
	useSpotifyTrackSearch: (...args: unknown[]) =>
		mockUseSpotifyTrackSearch(...args),
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

it('Adds a track to the selected list when the add button is clicked', async () => {
	mockUseSpotifyTrackSearch.mockReturnValueOnce({
		tracks: [SpBasketCase],
		loading: false,
		error: null,
	});
	render(<SearchAndAddTrack />);
	const addBasketCase = screen.getByRole('button', {
		name: /Add "Basket Case"/i,
	});
	await userEvent.click(addBasketCase);
	const rmBasketCase = screen.getByRole('button', {
		name: /Remove "Basket Case"/i,
	});
	expect(rmBasketCase).toBeInTheDocument();
});

it('Does not add a duplicate track', async () => {
	mockUseSpotifyTrackSearch.mockReturnValue({
		tracks: [SpBasketCase],
		loading: false,
		error: null,
	});
	render(<SearchAndAddTrack />);
	const addBasketCase = screen.getByRole('button', { name: /Add "Basket Case"/i });
	await userEvent.click(addBasketCase);
	await userEvent.click(addBasketCase);
	const rmButtons = screen.getAllByRole('button', { name: /Remove "Basket Case"/i });
	expect(rmButtons).toHaveLength(1);
	mockUseSpotifyTrackSearch.mockReturnValue({ tracks: null, loading: null, error: null });
});

it('Removes a track from the selected list when the remove button is clicked', async () => {
	mockUseSpotifyTrackSearch.mockReturnValueOnce({
		tracks: [SpBasketCase],
		loading: false,
		error: null,
	});
	render(<SearchAndAddTrack />);
	const addBasketCase = screen.getByRole('button', {
		name: /Add "Basket Case"/i,
	});
	await userEvent.click(addBasketCase);
	const rmBasketCase = screen.getByRole('button', {
		name: /Remove "Basket Case"/i,
	});
	await userEvent.click(rmBasketCase);
	const rmBasketCaseAfter = screen.queryByRole('button', {
		name: /Remove "Basket Case"/i,
	});
	expect(rmBasketCaseAfter).not.toBeInTheDocument();
});
