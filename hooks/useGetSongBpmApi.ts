'use client';

import { useReducer, useEffect } from 'react';
import {
	GsbSong,
	GsbSongResult,
	GsbTempo,
	GsbTempoResult,
} from '@/models/getSongBpm';
import { AsyncState, AsyncAction } from '@/models/async';

// GetSongBPM API, https://getsongbpm.com/api
const LOCAL_SONG_ENDPOINT = '/api/gsb/song';
const LOCAL_TEMPO_ENDPOINT = '/api/gsb/tempo';

function initialState<T>(): AsyncState<T> {
	return { status: 'idle', data: null, error: null };
}

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
 * Calls the GetSongBPM API to search for songs matching a title.
 * @param song - Song title to search for.
 * @returns A {@link GsbSongResult}
 */
export function useGsbSongSearch(song: string | null): GsbSongResult {
	const [state, dispatch] = useReducer(
		reducer<GsbSong[]>,
		initialState<GsbSong[]>(),
	);

	useEffect(() => {
		if (!song) {
			dispatch({ type: 'clear' });
			return;
		}

		dispatch({ type: 'fetch' });

		const url = new URL(LOCAL_SONG_ENDPOINT, window.location.origin);
		url.searchParams.set('song', song);

		fetch(url)
			.then((res) => {
				if (!res.ok) throw new Error(`GetSongBPM API error: ${res.status}`);
				return res.json() as Promise<GsbSong[]>;
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
	}, [song]);

	return {
		songs: state.data,
		loading: state.status === 'loading',
		error: state.error,
	};
}

/**
 * Calls the GetSongBPM API to search for tracks matching a target BPM.
 * @param bpm - Target tempo in beats per minute.
 * @returns A {@link GsbTempoResult}
 */
export function useGsbTempoSearch(bpm: number | null): GsbTempoResult {
	const [state, dispatch] = useReducer(
		reducer<GsbTempo[]>,
		initialState<GsbTempo[]>(),
	);

	useEffect(() => {
		if (!bpm) {
			dispatch({ type: 'clear' });
			return;
		}

		dispatch({ type: 'fetch' });

		const url = new URL(LOCAL_TEMPO_ENDPOINT, window.location.origin);
		url.searchParams.set('bpm', String(bpm));

		fetch(url)
			.then((res) => {
				if (!res.ok) throw new Error(`GetSongBPM API error: ${res.status}`);
				return res.json() as Promise<GsbTempo[]>;
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
	}, [bpm]);

	return {
		songs: state.data,
		loading: state.status === 'loading',
		error: state.error,
	};
}
