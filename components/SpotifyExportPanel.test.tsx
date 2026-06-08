import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSession } from 'next-auth/react';
import { SpotifyJVibesPlaylist } from '@/mocks/SpotifyPlaylistMocks';
import SpotifyExportPanel from './SpotifyExportPanel';

jest.mock('next-auth/react', () => ({ useSession: jest.fn() }));
const mockUseSession = useSession as jest.Mock;
mockUseSession.mockReturnValue({ data: { spotifyAccessToken: 'mock-token' }, status: 'authenticated' });

const mockUseSpotifyEditablePlaylists = jest.fn();
mockUseSpotifyEditablePlaylists.mockReturnValue({ playlists: null, loading: false });

jest.mock('../hooks/useSpotifyEditablePlaylists', () => ({
	useSpotifyEditablePlaylists: (...args: unknown[]) =>
		mockUseSpotifyEditablePlaylists(...args),
}));

const mockSetSelectedPlaylist = jest.fn();
const mockHandleSave = jest.fn();

const defaultExportState = {
	addError: null,
	addLoading: false,
	handleSave: mockHandleSave,
	resolveError: null,
	resolving: false,
	saveSuccess: null,
	selectedPlaylist: null,
	setSelectedPlaylist: mockSetSelectedPlaylist,
};

const mockUseSpotifyExportState = jest.fn();
mockUseSpotifyExportState.mockReturnValue(defaultExportState);

jest.mock('../hooks/useSpotifyExportState', () => ({
	useSpotifyExportState: (...args: unknown[]) => mockUseSpotifyExportState(...args),
}));

const defaultProps = {
	clearMarks: jest.fn(),
	markedTrackIds: new Set<string>(),
	onBack: jest.fn(),
	tracks: [],
};

it('Shows the playlist picker when no playlist is selected', () => {
	render(<SpotifyExportPanel {...defaultProps} />);
	const heading = screen.getByText(/add to playlist/i);
	expect(heading).toBeInTheDocument();
});

it('Shows a Back button in the picker view', () => {
	render(<SpotifyExportPanel {...defaultProps} />);
	const backBtn = screen.getByRole('button', { name: /back/i });
	expect(backBtn).toBeInTheDocument();
});

it('Calls onBack when the Back button is clicked', async () => {
	const onBack = jest.fn();
	render(<SpotifyExportPanel {...defaultProps} onBack={onBack} />);
	const backBtn = screen.getByRole('button', { name: /back/i });
	await userEvent.click(backBtn);
	expect(onBack).toHaveBeenCalled();
});

it('Calls setSelectedPlaylist when a playlist button is clicked', async () => {
	mockUseSpotifyEditablePlaylists.mockReturnValueOnce({
		playlists: [SpotifyJVibesPlaylist],
		loading: false,
	});
	render(<SpotifyExportPanel {...defaultProps} />);
	const playlistBtn = screen.getByRole('button', { name: /j-vibes/i });
	await userEvent.click(playlistBtn);
	expect(mockSetSelectedPlaylist).toHaveBeenCalledWith(SpotifyJVibesPlaylist);
});

it('Shows the selected playlist name when a playlist is selected', () => {
	mockUseSpotifyExportState.mockReturnValueOnce({
		...defaultExportState,
		selectedPlaylist: SpotifyJVibesPlaylist,
	});
	render(<SpotifyExportPanel {...defaultProps} />);
	const name = screen.getByText(/j-vibes/i);
	expect(name).toBeInTheDocument();
});

it('Save button is disabled when markedTrackIds is empty', () => {
	mockUseSpotifyExportState.mockReturnValueOnce({
		...defaultExportState,
		selectedPlaylist: SpotifyJVibesPlaylist,
	});
	render(<SpotifyExportPanel {...defaultProps} markedTrackIds={new Set()} />);
	const saveBtn = screen.getByRole('button', { name: /save/i });
	expect(saveBtn).toBeDisabled();
});

it('Save button is enabled when markedTrackIds has items', () => {
	mockUseSpotifyExportState.mockReturnValueOnce({
		...defaultExportState,
		selectedPlaylist: SpotifyJVibesPlaylist,
	});
	render(<SpotifyExportPanel {...defaultProps} markedTrackIds={new Set(['t1', 't2', 't3'])} />);
	const saveBtn = screen.getByRole('button', { name: /save/i });
	expect(saveBtn).toBeEnabled();
});

it('Calls handleSave when the Save button is clicked', async () => {
	mockUseSpotifyExportState.mockReturnValueOnce({
		...defaultExportState,
		selectedPlaylist: SpotifyJVibesPlaylist,
	});
	render(<SpotifyExportPanel {...defaultProps} markedTrackIds={new Set(['t1', 't2'])} />);
	const saveBtn = screen.getByRole('button', { name: /save/i });
	await userEvent.click(saveBtn);
	expect(mockHandleSave).toHaveBeenCalled();
});

it('Shows the save error message when saveError is provided', () => {
	mockUseSpotifyExportState.mockReturnValueOnce({
		...defaultExportState,
		resolveError: 'Spotify API error: 403',
		selectedPlaylist: SpotifyJVibesPlaylist,
	});
	render(<SpotifyExportPanel {...defaultProps} />);
	const msg = screen.getByText(/spotify api error: 403/i);
	expect(msg).toBeInTheDocument();
});

it('Shows the save success message when saveSuccess is provided', () => {
	mockUseSpotifyExportState.mockReturnValueOnce({
		...defaultExportState,
		saveSuccess: 'Saved 3 tracks to J-Vibes',
		selectedPlaylist: SpotifyJVibesPlaylist,
	});
	render(<SpotifyExportPanel {...defaultProps} />);
	const msg = screen.getByText(/saved 3 tracks to j-vibes/i);
	expect(msg).toBeInTheDocument();
});

it('Calls setSelectedPlaylist(null) when Change is clicked', async () => {
	mockUseSpotifyExportState.mockReturnValueOnce({
		...defaultExportState,
		selectedPlaylist: SpotifyJVibesPlaylist,
	});
	render(<SpotifyExportPanel {...defaultProps} markedTrackIds={new Set(['t1', 't2'])} />);
	const changeBtn = screen.getByRole('button', { name: /change/i });
	await userEvent.click(changeBtn);
	expect(mockSetSelectedPlaylist).toHaveBeenCalledWith(null);
});
