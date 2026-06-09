'use client';

import { useReducer, useState } from 'react';
import {
	initialMutationState,
	mutationReducer,
} from '@/hooks/api/mutationReducer';
import {
	useSpotifyPlaylistAddTracks,
	useSpotifyTrackLookup,
} from '@/hooks/api/useSpotifyApi';
import { Track } from '@/models/rhythmRun';
import { SpotifyPlaylist } from '@/models/spotify';

/**
 * Manages the full Spotify export state and flow: resolves track URIs, adds
 * them to the selected playlist, and returns the loading, error, and
 * success state.
 *
 * @param tracks - The tracks to export
 * @param onSuccess - Optional callback invoked after tracks are successfully added to the playlist
 */
export function useSpotifyExportState(tracks: Track[], onSuccess?: () => void) {
	const { addTracks } = useSpotifyPlaylistAddTracks();
	const { resolveUris } = useSpotifyTrackLookup();

	const [selectedPlaylist, setSelectedPlaylist] =
		useState<SpotifyPlaylist | null>(null);
	const [state, dispatch] = useReducer(
		mutationReducer<string>,
		initialMutationState<string>(),
	);

	async function handleSave() {
		if (!selectedPlaylist || tracks.length === 0) return;

		dispatch({ type: 'submit' });

		try {
			const { uris, matched } = await resolveUris(tracks);

			if (uris.length === 0) {
				dispatch({
					type: 'error',
					error: 'No tracks could be matched on Spotify',
				});
				return;
			}

			await addTracks(selectedPlaylist.id, uris);

			const skipped = tracks.length - matched;
			const msg =
				skipped > 0
					? `Saved ${matched} track${matched !== 1 ? 's' : ''} (${skipped} couldn't be found on Spotify)`
					: `Saved ${matched} track${matched !== 1 ? 's' : ''} to ${selectedPlaylist.name}`;
			dispatch({ type: 'success', data: msg });
			if (onSuccess) onSuccess();
		} catch (err: unknown) {
			dispatch({
				type: 'error',
				error: err instanceof Error ? err.message : 'Unknown error',
			});
		}
	}

	return {
		error: state.error,
		handleSave,
		loading: state.status === 'submitting',
		saveSuccess: state.status === 'success' ? state.data : null,
		selectedPlaylist,
		setSelectedPlaylist,
	};
}
