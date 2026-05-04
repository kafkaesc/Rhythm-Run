'use client';

import { useReducer, useEffect } from 'react';
import { initialState, reducer } from '@/hooks/api/asyncReducer';
import {
	MbArtist,
	MbArtistResult,
	MbTrack,
	MbTrackResult,
} from '@/models/musicBrainz';

// MusicBrainz API, https://musicbrainz.org/doc/MusicBrainz_API
const LOCAL_ARTIST_ENDPOINT = '/api/musicbrainz/artist';
const LOCAL_RECORDING_ENDPOINT = '/api/musicbrainz/recording';

/**
 * Calls the MusicBrainz API to search for artists matching a name.
 * @param artist - Artist name to search for.
 * @returns A {@link MbArtistResult}
 */
export function useMusicBrainzArtistSearch(
	artist: string | null,
): MbArtistResult {
	const [state, dispatch] = useReducer(
		reducer<MbArtist[]>,
		initialState<MbArtist[]>(),
	);

	useEffect(() => {
		if (!artist) {
			dispatch({ type: 'clear' });
			return;
		}

		dispatch({ type: 'fetch' });

		const url = new URL(LOCAL_ARTIST_ENDPOINT, window.location.origin);
		url.searchParams.set('artist', artist);

		fetch(url)
			.then((res) => {
				if (!res.ok) {
					throw new Error(`MusicBrainz API error: ${res.status}`);
				}
				return res.json() as Promise<MbArtist[]>;
			})
			.then((data) => {
				dispatch({ type: 'success', data });
			})
			.catch((err: unknown) => {
				dispatch({
					type: 'error',
					error: err instanceof Error ? err.message : 'Unknown error',
				});
			});
	}, [artist]);

	return {
		artists: state.data,
		loading: state.status === 'loading',
		error: state.error,
	};
}

/**
 * Calls the MusicBrainz API to search for recordings matching a title.
 * @param track - Track title to search for.
 * @returns A {@link MbTrackResult}
 */
export function useMusicBrainzTrackSearch(track: string | null): MbTrackResult {
	const [state, dispatch] = useReducer(
		reducer<MbTrack[]>,
		initialState<MbTrack[]>(),
	);

	useEffect(() => {
		if (!track) {
			dispatch({ type: 'clear' });
			return;
		}

		dispatch({ type: 'fetch' });

		const url = new URL(LOCAL_RECORDING_ENDPOINT, window.location.origin);
		url.searchParams.set('track', track);

		fetch(url)
			.then((res) => {
				if (!res.ok) {
					throw new Error(`MusicBrainz API error: ${res.status}`);
				}
				return res.json() as Promise<MbTrack[]>;
			})
			.then((data) => {
				dispatch({ type: 'success', data });
			})
			.catch((err: unknown) => {
				dispatch({
					type: 'error',
					error: err instanceof Error ? err.message : 'Unknown error',
				});
			});
	}, [track]);

	return {
		tracks: state.data,
		loading: state.status === 'loading',
		error: state.error,
	};
}
