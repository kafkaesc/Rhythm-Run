'use client';

import Button from '@/components/elements/Button';
import H2 from '@/components/elements/H2';
import SpotifyIcon from '@/components/icons/SpotifyIcon';
import TrackTable from '@/components/TrackTable';
import { useSessionStatus } from '@/hooks/useSessionStatus';
import { Track } from '@/models/rhythmRun';

type TrackSelectionStepProps = {
	onNext: () => void;
	onToggleSelect: (id: string) => void;
	selectedIds: Set<string>;
	tracks: Track[];
};

export default function TrackSelectionStep({
	onNext,
	onToggleSelect,
	selectedIds,
	tracks,
}: TrackSelectionStepProps) {
	const { hasSpotify } = useSessionStatus();
	const spotifyConnected = hasSpotify();

	return (
		<>
			<H2>Matching Tracks</H2>
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
