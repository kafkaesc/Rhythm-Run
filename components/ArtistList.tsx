import { Icon } from '@iconify/react';
import Button from '@/components/elements/Button';
import { Artist } from '@/models/rhythmRun';

const AddIcon = () => <Icon icon="lucide:plus" height={16} width={16} />;

const RemoveIcon = () => <Icon icon="lucide:x" height={16} width={16} />;

type ArtistListProps<T> = {
	add?: (artist: T) => void;
	artists: T[] | null;
	remove?: (artist: T) => void;
	toArtist: (artist: T) => Artist;
};

export default function ArtistList<T>({
	add,
	artists,
	remove,
	toArtist,
}: ArtistListProps<T>) {
	if (!artists || artists.length === 0) return <></>;

	return (
		<div className="max-h-[11em] overflow-y-auto">
			<hr aria-hidden="true" />
			{artists.map((ar) => {
				const item = toArtist(ar);
				return (
					<div key={item.id}>
						<div className="flex items-center gap-2 py-1">
							{add && (
								<Button
									aria-label={`Add ${item.name}`}
									buttonStyle="black-white"
									className="p-0"
									mini
									type="button"
									onClick={() => add(ar)}
								>
									<AddIcon />
								</Button>
							)}
							{remove && (
								<Button
									aria-label={`Remove ${item.name}`}
									buttonStyle="danger"
									className="p-0"
									mini
									type="button"
									onClick={() => remove(ar)}
								>
									<RemoveIcon />
								</Button>
							)}
							<span>{item.name}</span>
						</div>
						<hr aria-hidden="true" />
					</div>
				);
			})}
		</div>
	);
}
