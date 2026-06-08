'use client';

import PlaylistButton from '@/components/PlaylistButton';
import { useSpotifyEditablePlaylists } from '@/hooks/useSpotifyEditablePlaylists';
import { SpotifyPlaylist } from '@/models/spotify';

type SpotifyPlaylistsProps = {
	selectPlaylist?: (sp: SpotifyPlaylist) => void;
};

/**
 * Renders the user's editable (owned or collaborative) Spotify playlists
 * as a list. When selectPlaylist is passed, each item renders as a button
 * that calls it as a callback. When omitted, each item renders as a link
 * to the playlist on Spotify.
 *
 * @param selectPlaylist - Optional, callback invoked with the chosen {@link SpotifyPlaylist}
 */
export default function SpotifyPlaylists({
	selectPlaylist,
}: SpotifyPlaylistsProps) {
	const { playlists, loading } = useSpotifyEditablePlaylists();

	if (loading) return null;

	if (!playlists) return null;

	return (
		<ul className="flex flex-col gap-1">
			{playlists.map((playlist) =>
				selectPlaylist ? (
					<li key={playlist.id}>
						<PlaylistButton
							onClick={() => selectPlaylist(playlist)}
							playlist={playlist}
							type="button"
						/>
					</li>
				) : (
					<li key={playlist.id}>
						<PlaylistButton
							href={playlist.external_urls.spotify}
							playlist={playlist}
						/>
					</li>
				),
			)}
		</ul>
	);
}
