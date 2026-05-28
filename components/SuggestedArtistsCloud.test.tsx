import { render, screen } from '@testing-library/react';
import { SpBadBunny, SpDaftPunk } from '@/mocks/SpotifyArtistMocks';
import SuggestedArtistsCloud from './SuggestedArtistsCloud';

const mockArtists = [SpBadBunny, SpDaftPunk];

const mockGetRandomSpotifyTopArtists = jest.fn();
mockGetRandomSpotifyTopArtists.mockReturnValue(mockArtists);

const mockUseSpotifyTopArtists = jest.fn();
mockUseSpotifyTopArtists.mockReturnValue({
	artists: mockArtists,
	error: null,
	getRandomSpotifyTopArtists: mockGetRandomSpotifyTopArtists,
	getSpotifyTopArtists: jest.fn(),
	loading: false,
});

jest.mock('../hooks/useSpotifyTopArtists', () => ({
	useSpotifyTopArtists: (...args: unknown[]) =>
		mockUseSpotifyTopArtists(...args),
}));

it('Returns null when loading', () => {
	mockUseSpotifyTopArtists.mockReturnValueOnce({
		artists: null,
		error: null,
		getRandomSpotifyTopArtists: jest.fn().mockReturnValue([]),
		getSpotifyTopArtists: jest.fn(),
		loading: true,
	});
	const { container } = render(<SuggestedArtistsCloud />);
	expect(container).toBeEmptyDOMElement();
});

it('Returns null when there are no suggested artists and no Spotify error', () => {
	mockUseSpotifyTopArtists.mockReturnValueOnce({
		artists: [],
		error: null,
		getRandomSpotifyTopArtists: jest.fn().mockReturnValue([]),
		getSpotifyTopArtists: jest.fn(),
		loading: false,
	});
	const { container } = render(<SuggestedArtistsCloud />);
	expect(container).toBeEmptyDOMElement();
});

it('Renders the suggested artists label', () => {
	render(<SuggestedArtistsCloud onSelect={jest.fn()} />);
	const label = screen.getByText(/suggested artists/i);
	expect(label).toBeInTheDocument();
});

it('Renders artist names as buttons when onSelect is provided', () => {
	render(<SuggestedArtistsCloud onSelect={jest.fn()} />);
	const badBunnyBtn = screen.getByRole('button', { name: /add bad bunny/i });
	const daftPunkBtn = screen.getByRole('button', { name: /add daft punk/i });
	expect(badBunnyBtn).toBeInTheDocument();
	expect(daftPunkBtn).toBeInTheDocument();
});

it('Renders artist names as links when onSelect is not provided', () => {
	render(<SuggestedArtistsCloud />);
	const badBunnyLink = screen.getByRole('link', { name: /bad bunny/i });
	const daftPunkLink = screen.getByRole('link', { name: /daft punk/i });
	expect(badBunnyLink).toBeInTheDocument();
	expect(daftPunkLink).toBeInTheDocument();
});

it('Renders the Spotify error message when spotifyError is set', () => {
	mockUseSpotifyTopArtists.mockReturnValueOnce({
		artists: [],
		error: '400 Error',
		getRandomSpotifyTopArtists: jest.fn().mockReturnValue([]),
		getSpotifyTopArtists: jest.fn(),
		loading: false,
	});
	render(<SuggestedArtistsCloud />);
	const errorMsg = screen.getByText(/could not load spotify artists/i);
	expect(errorMsg).toBeInTheDocument();
});

it('Disables all artist buttons when isFull is true', () => {
	render(<SuggestedArtistsCloud isFull={true} onSelect={jest.fn()} />);
	const buttons = screen.getAllByRole('button');
	buttons.forEach((btn) => expect(btn).toBeDisabled());
});

it('Sets aria-label to add artist when not disabled', () => {
	render(<SuggestedArtistsCloud onSelect={jest.fn()} />);
	const btn = screen.getByRole('button', {
		name: /add bad bunny to selected artists/i,
	});
	expect(btn).toBeInTheDocument();
});

it('Sets aria-label to max message when isFull and limit are provided', () => {
	render(
		<SuggestedArtistsCloud isFull={true} limit={5} onSelect={jest.fn()} />,
	);
	const buttons = screen.getAllByRole('button');
	buttons.forEach((btn) =>
		expect(btn).toHaveAccessibleName(
			/the maximum of 5 artists has already been selected/i,
		),
	);
});
