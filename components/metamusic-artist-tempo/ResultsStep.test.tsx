import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSession } from 'next-auth/react';
import ResultsStep from './ResultsStep';

jest.mock('next-auth/react', () => ({ useSession: jest.fn() }));
const mockUseSession = useSession as jest.Mock;
mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });

const spotifySession = {
	data: { spotifyAccessToken: 'mock-token' },
	status: 'authenticated',
};

const mockTrack = { artists: ['Green Day'], id: 'track-1', title: 'Basket Case' };

const defaultProps = {
	markedTrackIds: new Set<string>(),
	onNext: jest.fn(),
	toggleMark: jest.fn(),
	tracks: [mockTrack],
};

it('Renders the Matching Tracks heading', () => {
	render(<ResultsStep {...defaultProps} />);
	const heading = screen.getByRole('heading', { name: /matching tracks/i });
	expect(heading).toBeInTheDocument();
});

it('Does not show the Select a Spotify Playlist button when not logged in with Spotify', () => {
	render(<ResultsStep {...defaultProps} />);
	const btn = screen.queryByRole('button', { name: /select a spotify playlist/i });
	expect(btn).not.toBeInTheDocument();
});

it('Shows the Select a Spotify Playlist button when logged in with Spotify', () => {
	mockUseSession.mockReturnValueOnce(spotifySession);
	render(<ResultsStep {...defaultProps} markedTrackIds={new Set(['track-1'])} />);
	const btn = screen.getByRole('button', { name: /select a spotify playlist/i });
	expect(btn).toBeInTheDocument();
});

it('Select a Spotify Playlist button is disabled when no tracks are marked', () => {
	mockUseSession.mockReturnValueOnce(spotifySession);
	render(<ResultsStep {...defaultProps} markedTrackIds={new Set()} />);
	const btn = screen.getByRole('button', { name: /select a spotify playlist/i });
	expect(btn).toBeDisabled();
});

it('Select a Spotify Playlist button is enabled when tracks are marked', () => {
	mockUseSession.mockReturnValueOnce(spotifySession);
	render(<ResultsStep {...defaultProps} markedTrackIds={new Set(['track-1'])} />);
	const btn = screen.getByRole('button', { name: /select a spotify playlist/i });
	expect(btn).toBeEnabled();
});

it('Calls onNext when the Select a Spotify Playlist button is clicked', async () => {
	mockUseSession.mockReturnValueOnce(spotifySession);
	const onNext = jest.fn();
	render(
		<ResultsStep
			{...defaultProps}
			markedTrackIds={new Set(['track-1'])}
			onNext={onNext}
		/>,
	);
	const btn = screen.getByRole('button', { name: /select a spotify playlist/i });
	await userEvent.click(btn);
	expect(onNext).toHaveBeenCalled();
});
