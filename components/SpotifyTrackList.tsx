import { SpotifyTrack } from '@/models/spotify';

type SpotifyTrackListProps = {
	tracks: SpotifyTrack[] | null;
};

/**
 * Renders a list of Spotify tracks
 * @param tracks - The list of Spotify tracks to display
 */
export default function SpotifyTrackList({ tracks }: SpotifyTrackListProps) {
	// If there are no tracks, return an empty fragment
	if (!tracks) return <></>;

	return (
		<div>
			<hr />
			{tracks.map((tr) => (
				<div key={tr.id}>
					<p className="py-2">
						&quot;{tr.name}&quot; by {tr.artists.map((ar) => ar.name)}
					</p>
					<hr />
				</div>
			))}
		</div>
	);
}
