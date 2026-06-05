import { render, screen } from '@testing-library/react';
import { LfmBadBunny } from '@/mocks/LfmArtistMocks';
import MetaMusicArtistTempo from './MetaMusicArtistTempo';

const mockUseMetaMusicArtistTempo = jest.fn();
mockUseMetaMusicArtistTempo.mockReturnValue({
	tracks: null,
	loading: false,
	streaming: false,
	error: null,
});

jest.mock('../hooks/api/useMetaMusic', () => ({
	useMetaMusicArtistTempo: (...args: unknown[]) =>
		mockUseMetaMusicArtistTempo(...args),
}));

const mockUseSet = jest.fn();
mockUseSet.mockReturnValue({
	set: [],
	add: jest.fn(),
	clear: jest.fn(),
	isFull: jest.fn().mockReturnValue(false),
	remove: jest.fn(),
});

jest.mock('../hooks/useSet', () => ({
	useSet: (...args: unknown[]) => mockUseSet(...args),
}));

const mockUseSpotifyTopArtists = jest.fn();
mockUseSpotifyTopArtists.mockReturnValue({
	artists: [],
	error: null,
	getRandomSpotifyTopArtists: jest.fn().mockReturnValue([]),
	getSpotifyTopArtists: jest.fn(),
	loading: false,
});

jest.mock('../hooks/useSpotifyTopArtists', () => ({
	useSpotifyTopArtists: (...args: unknown[]) =>
		mockUseSpotifyTopArtists(...args),
}));

const mockUseLastFmArtistSearch = jest.fn();
mockUseLastFmArtistSearch.mockReturnValue({
	artists: null,
	loading: null,
	error: null,
});

jest.mock('../hooks/api/useLastFmApi', () => ({
	useLastFmArtistSearch: (...args: unknown[]) =>
		mockUseLastFmArtistSearch(...args),
}));

const mockTrack = { artists: ['Green Day'], id: 'track-1', title: 'Basket Case' };

it('Renders the Find Tracks button', () => {
	render(<MetaMusicArtistTempo />);
	const btn = screen.getByRole('button', { name: /find tracks/i });
	expect(btn).toBeInTheDocument();
});

it('Renders the Find Tracks button as disabled when no artists are selected', () => {
	render(<MetaMusicArtistTempo />);
	const btn = screen.getByRole('button', { name: /find tracks/i });
	expect(btn).toBeDisabled();
});

it('Renders the Find Tracks button as enabled when artists are selected', () => {
	mockUseSet.mockReturnValueOnce({
		set: [LfmBadBunny],
		add: jest.fn(),
		clear: jest.fn(),
		isFull: jest.fn().mockReturnValue(false),
		remove: jest.fn(),
	});
	render(<MetaMusicArtistTempo />);
	const btn = screen.getByRole('button', { name: /find tracks/i });
	expect(btn).toBeEnabled();
});

it('Renders the Matching Tracks heading when tracks are returned', () => {
	mockUseMetaMusicArtistTempo.mockReturnValueOnce({
		tracks: [mockTrack],
		loading: false,
		streaming: false,
		error: null,
	});
	render(<MetaMusicArtistTempo />);
	const heading = screen.getByRole('heading', { name: /matching tracks/i });
	expect(heading).toBeInTheDocument();
});

it('Renders the error message when the hook returns an error', () => {
	mockUseMetaMusicArtistTempo.mockReturnValueOnce({
		tracks: null,
		loading: false,
		streaming: false,
		error: 'Something went wrong',
	});
	render(<MetaMusicArtistTempo />);
	const errorMsg = screen.getByText(/error with the metamusic response/i);
	expect(errorMsg).toBeInTheDocument();
});

it('Shows loading status when the hook is loading', () => {
	mockUseMetaMusicArtistTempo.mockReturnValueOnce({
		tracks: null,
		loading: true,
		streaming: false,
		error: null,
	});
	render(<MetaMusicArtistTempo />);
	const loadingMsg = screen.getByText(/loading/i);
	expect(loadingMsg).toBeInTheDocument();
});
