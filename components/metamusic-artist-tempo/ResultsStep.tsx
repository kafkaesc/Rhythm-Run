'use client';

import Button from '@/components/elements/Button';
import H2 from '@/components/elements/H2';
import SpotifyIcon from '@/components/icons/SpotifyIcon';
import TrackTable from '@/components/TrackTable';
import { useSessionStatus } from '@/hooks/useSessionStatus';
import { Track } from '@/models/rhythmRun';

type ResultsStepProps = {
	markedTrackIds: Set<string>;
	onNext: () => void;
	toggleMark: (id: string) => void;
	tracks: Track[];
};

export default function ResultsStep({
	markedTrackIds,
	onNext,
	toggleMark,
	tracks,
}: ResultsStepProps) {
	const { hasSpotify } = useSessionStatus();
	const spotifyConnected = hasSpotify();

	return (
		<>
			<H2>Matching Tracks</H2>
			<TrackTable
				markedTrackIds={spotifyConnected ? markedTrackIds : undefined}
				onToggleMark={spotifyConnected ? toggleMark : undefined}
				tracks={tracks}
			/>
			{spotifyConnected && (
				<Button
					buttonStyle="black-white"
					className="self-center mb-4"
					disabled={markedTrackIds.size === 0}
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
