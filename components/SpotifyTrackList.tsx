import Button from '@/components/elements/Button';
import { SpotifyTrack } from '@/models/spotify';

type SpotifyTrackListProps = {
	add?: (track: SpotifyTrack) => void;
	tracks: SpotifyTrack[] | null;
	remove?: (track: SpotifyTrack) => void;
};

/**
 * Renders a list of Spotify tracks
 * @param add - Optional delegate function to add a track somewhere external
 * @param tracks - The list of Spotify tracks to display
 * @param remove - Optional delegate function to remove a track from somewhere external
 */
export default function SpotifyTrackList({
	add,
	tracks,
	remove,
}: SpotifyTrackListProps) {
	// If there are no tracks, return an empty fragment
	if (!tracks || tracks.length === 0) return <></>;

	return (
		<div>
			<hr />
			{tracks.map((tr) => (
				<div key={tr.id}>
					<div className="flex items-center gap-2 py-2">
						{add && (
							<Button
								buttonStyle="black-white"
								mini
								type="button"
								onClick={() => add(tr)}
							>
								+
							</Button>
						)}
						{remove && (
							<Button
								buttonStyle="danger"
								className="cursor-pointer"
								mini
								type="button"
								onClick={() => remove(tr)}
							>
								&times;
							</Button>
						)}
						<span>
							&quot;{tr.name}&quot; by{' '}
							{tr.artists.map((ar) => ar.name).join(', ')}
						</span>
					</div>
					<hr />
				</div>
			))}
		</div>
	);
}
