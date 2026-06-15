'use client';

import {
	useSpotifyCurrentUser,
	useSpotifyPlaylists,
} from '@/hooks/api/useSpotifyApi';
import { SpotifyPlaylist } from '@/models/spotify';

/**
 * Returns only the playlists the logged-in Spotify user owns or
 * collaborates on. Returns all playlists if the current user ID
 * cannot be determined.
 */
export function useSpotifyEditablePlaylists(): {
	playlists: SpotifyPlaylist[] | null;
	loading: boolean;
	error: string | null;
} {
	const {
		playlists,
		loading: playlistsLoading,
		error: playlistsError,
	} = useSpotifyPlaylists();
	const {
		user,
		loading: userLoading,
		error: userError,
	} = useSpotifyCurrentUser();

	const loading = playlistsLoading || userLoading;
	const error = playlistsError ?? userError;

	if (!playlists) return { playlists: null, loading, error };

	const editablePlaylists = user
		? playlists.filter((p) => p.collaborative || p.owner.id === user.id)
		: playlists;

	return { playlists: editablePlaylists, loading, error };
}
