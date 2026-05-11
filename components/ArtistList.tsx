import Button from '@/components/elements/Button';
import AddIcon from '@/components/icons/AddIcon';
import RemoveIcon from '@/components/icons/RemoveIcon';
import { Artist } from '@/models/rhythmRun';

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
									<AddIcon height={16} width={16} />
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
									<RemoveIcon height={16} width={16} />
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
