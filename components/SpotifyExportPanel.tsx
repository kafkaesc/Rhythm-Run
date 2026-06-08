'use client';

import Button from '@/components/elements/Button';
import H2 from '@/components/elements/H2';
import Scrollable from '@/components/layout/Scrollable';
import SpotifyPlaylists from '@/components/SpotifyPlaylists';
import { useSessionStatus } from '@/hooks/useSessionStatus';
import { useSpotifyExportState } from '@/hooks/useSpotifyExportState';
import { Track } from '@/models/rhythmRun';

type SpotifyExportPanelProps = {
	clearMarks: () => void;
	markedTrackIds: Set<string>;
	onBack: () => void;
	tracks: Track[];
};

export default function SpotifyExportPanel(props: SpotifyExportPanelProps) {
	const { hasSpotify } = useSessionStatus();
	if (!hasSpotify()) return null;
	return <SpotifyExportPanelInner {...props} />;
}

function SpotifyExportPanelInner({
	clearMarks,
	markedTrackIds,
	onBack,
	tracks,
}: SpotifyExportPanelProps) {
	const {
		addError,
		addLoading,
		handleSave,
		resolveError,
		resolving,
		saveSuccess,
		selectedPlaylist,
		setSelectedPlaylist,
	} = useSpotifyExportState(tracks, markedTrackIds, clearMarks);

	const saveError = resolveError ?? addError;
	const saveLoading = resolving || addLoading;
	const markedCount = markedTrackIds.size;
	const trackWord = markedCount === 1 ? 'track' : 'tracks';

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
							disabled={markedCount === 0 || saveLoading}
							onClick={handleSave}
							type="button"
						>
							{saveLoading
								? 'Saving...'
								: `Save ${markedCount} ${trackWord} to playlist`}
						</Button>
					</div>
					{saveError && <p className="text-danger text-sm">{saveError}</p>}
					{!saveError && saveSuccess && (
						<p className="text-sm">{saveSuccess}</p>
					)}
				</div>
			)}
		</div>
	);
}
