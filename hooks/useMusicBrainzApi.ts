'use client';

import { useReducer, useEffect } from 'react';
import {
	MbArtist,
	MbArtistResult,
	MbTrack,
	MbTrackResult,
} from '@/models/musicBrainz';
import { AsyncState, AsyncAction } from '@/models/async';

// MusicBrainz API, https://musicbrainz.org/doc/MusicBrainz_API
const LOCAL_ARTIST_ENDPOINT = '/api/musicbrainz/artist';
const LOCAL_RECORDING_ENDPOINT = '/api/musicbrainz/recording';

/** Initial state for an async fetch is idling with no data or error. */
function initialState<T>(): AsyncState<T> {
	return { status: 'idle', data: null, error: null };
}

/**
 * Reducer function for async fetch state transitions for a given data type, T.
 * @param _state - The current state (unused; each action returns a full replacement).
 * @param _action - The action describing the transition: 'fetch', 'success', 'error', or 'clear'.
 * @returns A new {@link AsyncState} reflecting the dispatched action.
 */
function reducer<T>(
	_state: AsyncState<T>,
	_action: AsyncAction<T>,
): AsyncState<T> {
	if (_action.type === 'fetch')
		return { status: 'loading', data: null, error: null };
	if (_action.type === 'success')
		return { status: 'success', data: _action.data, error: null };
	if (_action.type === 'error')
		return { status: 'error', data: null, error: _action.error };
	if (_action.type === 'clear')
		return { status: 'idle', data: null, error: null };

	throw new Error('Unhandled action type');
}

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
				if (!res.ok) throw new Error(`MusicBrainz API error: ${res.status}`);
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
export function useMusicBrainzTrackSearch(
	track: string | null,
): MbTrackResult {
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
				if (!res.ok) throw new Error(`MusicBrainz API error: ${res.status}`);
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
