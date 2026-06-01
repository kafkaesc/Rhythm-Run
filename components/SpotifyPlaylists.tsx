'use client';

import PlaylistButton from '@/components/PlaylistButton';
import { useSpotifyPlaylists } from '@/hooks/api/useSpotifyApi';
import { SpotifyPlaylist } from '@/models/spotify';

type SpotifyPlaylistsProps = {
	selectPlaylist?: (sp: SpotifyPlaylist) => void;
};

export default function SpotifyPlaylists({
	selectPlaylist,
}: SpotifyPlaylistsProps) {
	const { playlists, loading } = useSpotifyPlaylists();

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
