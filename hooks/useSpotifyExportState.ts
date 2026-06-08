'use client';

import { useState } from 'react';
import {
	useSpotifyPlaylistAddTracks,
	useSpotifyTrackLookup,
} from '@/hooks/api/useSpotifyApi';
import { Track } from '@/models/rhythmRun';
import { SpotifyPlaylist } from '@/models/spotify';

export function useSpotifyExportState(
	tracks: Track[] | null,
	markedTrackIds: Set<string>,
	clearMarks: () => void,
) {
	const { addTracks, loading: addLoading, error: addError } =
		useSpotifyPlaylistAddTracks();
	const { resolveUris } = useSpotifyTrackLookup();

	const [selectedPlaylist, setSelectedPlaylist] =
		useState<SpotifyPlaylist | null>(null);
	const [resolving, setResolving] = useState(false);
	const [resolveError, setResolveError] = useState<string | null>(null);
	const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

	async function handleSave() {
		if (!selectedPlaylist || markedTrackIds.size === 0 || !tracks) return;
		const tracksToSave = tracks.filter((t) => markedTrackIds.has(t.id));

		setResolveError(null);
		setSaveSuccess(null);
		setResolving(true);

		try {
			const { uris, matched } = await resolveUris(tracksToSave);

			if (uris.length === 0) {
				setResolveError('No tracks could be matched on Spotify');
				return;
			}

			const success = await addTracks(selectedPlaylist.id, uris);

			if (success) {
				const skipped = tracksToSave.length - matched;
				const msg =
					skipped > 0
						? `Saved ${matched} track${matched !== 1 ? 's' : ''} (${skipped} couldn't be found on Spotify)`
						: `Saved ${matched} track${matched !== 1 ? 's' : ''} to ${selectedPlaylist.name}`;
				setSaveSuccess(msg);
				clearMarks();
			}
		} finally {
			setResolving(false);
		}
	}

	return {
		addError,
		addLoading,
		handleSave,
		resolveError,
		resolving,
		saveSuccess,
		selectedPlaylist,
		setSelectedPlaylist,
	};
}
