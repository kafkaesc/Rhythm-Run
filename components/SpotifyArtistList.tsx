import Button from '@/components/elements/Button';
import { SpotifyArtist } from '@/models/spotify';

type SpotifyArtistListProps = {
	add?: (artist: SpotifyArtist) => void;
	artists: SpotifyArtist[] | null;
	remove?: (artist: SpotifyArtist) => void;
};

/**
 * Renders a list of Spotify artists
 * @param artists - The list of Spotify artists to display
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
					<div className="flex items-center gap-2 py-2">
						{add && (
							<Button
								buttonStyle="black-white"
								mini
								type="button"
								onClick={() => add(ar)}
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
								onClick={() => remove(ar)}
							>
								&times;
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
