'use client';

import Button from '@/components/elements/Button';
import H2 from '@/components/elements/H2';
import SpotifyIcon from '@/components/icons/SpotifyIcon';
import ArtistTempoTableNotifications from '@/components/metamusic-artist-tempo/ArtistTempoTableNotifications';
import TrackTable from '@/components/TrackTable';
import { useSessionStatus } from '@/hooks/useSessionStatus';
import { Track } from '@/models/rhythmRun';

type TrackSelectionStepProps = {
	noDataArtists?: string[];
	onNext: () => void;
	onToggleSelect: (id: string) => void;
	selectedIds: Set<string>;
	title?: string;
	tracks: Track[];
};

/**
 * Displays tracks in a sortable table. If the user has a Spotify session
 * it also allows them to select tracks for export and to advance
 * to the next step.
 *
 * @param onNext - Called when the user clicks "Select a Spotify Playlist"
 * @param onToggleSelect - Toggles selection of the track on a per row basis
 * @param selectedIds - Set of currently selected track IDs
 * @param title - Optional heading, defaults to "Tracks"
 * @param tracks - Array of tracks to display
 */
export default function TrackSelectionStep({
	noDataArtists,
	onNext,
	onToggleSelect,
	selectedIds,
	title = 'Tracks',
	tracks,
}: TrackSelectionStepProps) {
	const { hasSpotify } = useSessionStatus();
	const spotifyConnected = hasSpotify();

	return (
		<>
			<div className="-mb-4">
				<H2>{title}</H2>
				<ArtistTempoTableNotifications noDataArtists={noDataArtists} />
			</div>
			<TrackTable
				selectedIds={spotifyConnected ? selectedIds : undefined}
				onToggleSelect={spotifyConnected ? onToggleSelect : undefined}
				tracks={tracks}
			/>
			{spotifyConnected && (
				<Button
					buttonStyle="black-white"
					className="self-center mb-4"
					disabled={selectedIds.size === 0}
					icon={<SpotifyIcon aria-hidden="true" />}
					onClick={onNext}
					type="button"
				>
					Select a Spotify Playlist
				</Button>
			)}
		</>
	);
}
