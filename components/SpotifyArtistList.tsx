import { Icon } from '@iconify/react';
import Button from '@/components/elements/Button';
import { SpotifyArtist } from '@/models/spotify';

const AddIcon = () => <Icon icon="lucide:plus" height={16} width={16} />;

const RemoveIcon = () => <Icon icon="lucide:x" height={16} width={16} />;

type SpotifyArtistListProps = {
	add?: (artist: SpotifyArtist) => void;
	artists: SpotifyArtist[] | null;
	remove?: (artist: SpotifyArtist) => void;
};

/**
 * Renders a list of Spotify artists
 * @param add - Optional delegate function to add an artist somewhere external
 * @param artists - The list of Spotify artists to display
 * @param remove - Optional delegate function to remove an artist from somewhere external
 */
export default function SpotifyArtistList({
	add,
	artists,
	remove,
}: SpotifyArtistListProps) {
	// If there are no artists, return an empty fragment
	if (!artists || artists.length === 0) return <></>;

	return (
		<div>
			<hr />
			{artists.map((ar) => (
				<div key={ar.id}>
					<div className="flex items-center gap-2 py-1">
						{add && (
							<Button
								aria-label={`Add ${ar.name}`}
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
								aria-label={`Remove ${ar.name}`}
								buttonStyle="danger"
								className="p-0"
								mini
								type="button"
								onClick={() => remove(ar)}
							>
								<RemoveIcon />
							</Button>
						)}
						<span>{ar.name}</span>
					</div>
					<hr />
				</div>
			))}
		</div>
	);
}
