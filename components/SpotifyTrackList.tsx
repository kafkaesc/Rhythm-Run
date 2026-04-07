import { Icon } from '@iconify/react';
import Button from '@/components/elements/Button';
import { SpotifyTrack } from '@/models/spotify';

const AddIcon = () => <Icon icon="lucide:plus" height={16} width={16} />;

const RemoveIcon = () => <Icon icon="lucide:x" height={16} width={16} />;

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
		<div className="max-h-[11em] overflow-y-auto">
			<hr />
			{tracks.map((tr) => (
				<div key={tr.id}>
					<div className="flex items-center gap-2 py-1">
						{add && (
							<Button
								aria-label={`Add "${tr.name}" by ${tr.artists.map((ar) => ar.name).join(', ')}`}
								buttonStyle="black-white"
								className="p-0"
								mini
								type="button"
								onClick={() => add(tr)}
							>
								<AddIcon />
							</Button>
						)}
						{remove && (
							<Button
								aria-label={`Remove "${tr.name}" by ${tr.artists.map((ar) => ar.name).join(', ')}`}
								buttonStyle="danger"
								className="p-0"
								mini
								type="button"
								onClick={() => remove(tr)}
							>
								<RemoveIcon />
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
