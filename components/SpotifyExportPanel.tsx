'use client';

import Button from '@/components/elements/Button';
import H2 from '@/components/elements/H2';
import Scrollable from '@/components/layout/Scrollable';
import SpotifyPlaylists from '@/components/SpotifyPlaylists';
import { useSessionStatus } from '@/hooks/useSessionStatus';
import { useSpotifyExportState } from '@/hooks/useSpotifyExportState';
import { Track } from '@/models/rhythmRun';

type SpotifyExportPanelProps = {
	onBack: () => void;
	onSuccess?: () => void;
	tracks: Track[];
};

/**
 * Spotify export panel: add selected tracks to a Spotify playlist.
 * Returns null if the user does not have a Spotify session.
 *
 * @param onSuccess - Optional callback invoked after tracks are successfully exported
 * @param onBack - Callback to return to the results view
 * @param tracks - Pre-filtered list of tracks selected for export
 */
export default function SpotifyExportPanel(props: SpotifyExportPanelProps) {
	const { hasSpotify } = useSessionStatus();

	if (!hasSpotify()) return null;

	return <SpotifyExportPanelInner {...props} />;
}

function SpotifyExportPanelInner({
	onBack,
	onSuccess,
	tracks,
}: SpotifyExportPanelProps) {
	const {
		error,
		handleSave,
		loading,
		saveSuccess,
		selectedPlaylist,
		setSelectedPlaylist,
	} = useSpotifyExportState(tracks, onSuccess);

	const markedCount = tracks.length;
	const trackWord = markedCount === 1 ? 'track' : 'tracks';
	const saveBtnCta = loading
		? 'Saving...'
		: `Save ${markedCount} ${trackWord} to playlist`;

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between mx-auto w-full md:max-w-lg">
				<H2>Add to playlist</H2>
				<Button buttonStyle="black-white" mini onClick={onBack} type="button">
					Back
				</Button>
			</div>
			{!selectedPlaylist && (
				<Scrollable className="mx-auto w-full md:max-w-lg" maxHeight="24rem">
					<SpotifyPlaylists selectPlaylist={setSelectedPlaylist} />
				</Scrollable>
			)}
			{selectedPlaylist && (
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-center gap-2 mx-auto w-full md:max-w-lg">
						<span>
							Saving to the playlist: <strong>{selectedPlaylist.name}</strong>
						</span>
						<Button
							buttonStyle="black-white"
							mini
							onClick={() => setSelectedPlaylist(null)}
							type="button"
						>
							Change
						</Button>
					</div>
					<div className="flex justify-center">
						<Button
							buttonStyle="primary"
							disabled={markedCount === 0 || loading}
							onClick={handleSave}
							type="button"
						>
							{saveBtnCta}
						</Button>
					</div>
					{error && <p className="text-danger text-sm">{error}</p>}
					{!error && saveSuccess && <p className="text-sm">{saveSuccess}</p>}
				</div>
			)}
		</div>
	);
}
