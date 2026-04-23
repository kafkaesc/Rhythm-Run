import { Icon } from '@iconify/react';
import Button from '@/components/elements/Button';
import { Track } from '@/models/rhythmRun';

const AddIcon = () => <Icon icon="lucide:plus" height={16} width={16} />;

const RemoveIcon = () => <Icon icon="lucide:x" height={16} width={16} />;

type TrackListProps<T> = {
	add?: (track: T) => void;
	tracks: T[] | null;
	remove?: (track: T) => void;
	toTrack: (track: T) => Track;
};

/**
 * Renders a list of tracks
 * @param add - Optional delegate function to add a track somewhere external
 * @param tracks - The list of tracks to display
 * @param remove - Optional delegate function to remove a track from somewhere external
 * @param toTrackItem - Maps a track to the common {@link Track} shape for display
 */
export default function TrackList<T>({
	add,
	tracks,
	remove,
	toTrack,
}: TrackListProps<T>) {
	if (!tracks || tracks.length === 0) return <></>;

	return (
		<div className="max-h-[11em] overflow-y-auto">
			<hr />
			{tracks.map((tr) => {
				const item = toTrack(tr);
				return (
					<div key={item.id}>
						<div className="flex items-center gap-2 py-1">
							{add && (
								<Button
									aria-label={`Add "${item.title}" by ${item.artists.join(', ')}`}
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
									aria-label={`Remove "${item.title}" by ${item.artists.join(', ')}`}
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
								&quot;{item.title}&quot; by {item.artists.join(', ')}
							</span>
						</div>
						<hr />
					</div>
				);
			})}
		</div>
	);
}
