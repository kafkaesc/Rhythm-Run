'use client';

import { useReducer, useEffect } from 'react';
import {
	GsbArtist,
	GsbArtistResult,
	GsbSong,
	GsbSongResult,
	GsbTempo,
	GsbTempoResult,
} from '@/models/getSongBpm';
import { AsyncState, AsyncAction } from '@/models/async';

// GetSongBPM API, https://getsongbpm.com/api
const LOCAL_ARTIST_ENDPOINT = '/api/gsb/artist';
const LOCAL_SEARCH_ENDPOINT = '/api/gsb/search';
const LOCAL_SONG_ENDPOINT = '/api/gsb/song';
const LOCAL_TEMPO_ENDPOINT = '/api/gsb/tempo';

/** Initial state for an async fetch is idling with no data or error. */
function initialState<T>(): AsyncState<T> {
	return { status: 'idle', data: null, error: null };
}

/**
 * Reducer function for async fetch state transitions for a given data type, T.
 * @param _state - The current state (unused; each action returns a full replacement).
 * @param _action - The action describing the transition: 'fetch', 'success', or 'error'.
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

/** Returns true if a and b are within epsilon of each other. */
function withinEpsilon(
	a: string | number,
	b: string | number,
	epsilon: number,
): boolean {
	return Math.abs(Number(a) - Number(b)) <= epsilon;
}

/**
 * Calls the GetSongBPM API to search for artists matching a name.
 * @param artist - Artist name to search for.
 * @returns A {@link GsbArtistResult}
 */
export function useGsbArtistSearch(artist: string | null): GsbArtistResult {
	const [state, dispatch] = useReducer(
		reducer<GsbArtist[]>,
		initialState<GsbArtist[]>(),
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
				if (!res.ok) throw new Error(`GetSongBPM API error: ${res.status}`);
				return res.json() as Promise<GsbArtist[]>;
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
 * Calls the GetSongBPM API to retrieve all tracks for a specific artist.
 * @param artist - Artist name to search for.
 * @returns A {@link GsbSongResult}
 */
export function useGsbArtistTracks(artist: string | null): GsbSongResult {
	const [state, dispatch] = useReducer(
		reducer<GsbSong[]>,
		initialState<GsbSong[]>(),
	);

	useEffect(() => {
		if (!artist) {
			dispatch({ type: 'clear' });
			return;
		}

		dispatch({ type: 'fetch' });

		const url = new URL(LOCAL_SEARCH_ENDPOINT, window.location.origin);
		url.searchParams.set('artist', artist);

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
	}, [artist]);

	return {
		songs: state.data,
		loading: state.status === 'loading',
		error: state.error,
	};
}

/**
 * Calls the GetSongBPM API to search for tracks by a specific artist matching a target tempo.
 * @param artist - A {@link GsbArtist} object returned from a prior artist search.
 * @param tempo - Target tempo in beats per minute.
 * @param epsilon - Optional range around the target tempo to include in results.
 * @returns A {@link GsbSongResult}
 */
export function useGsbArtistTracksByTempo(
	artist: GsbArtist | null,
	tempo: string | null,
	epsilon?: number,
): GsbSongResult {
	const [state, dispatch] = useReducer(
		reducer<GsbSong[]>,
		initialState<GsbSong[]>(),
	);

	const artistId = artist?.id ?? null;
	const artistName = artist?.name ?? null;

	useEffect(() => {
		if (!artistId || !artistName || !tempo) {
			dispatch({ type: 'clear' });
			return;
		}

		dispatch({ type: 'fetch' });

		const url = new URL(LOCAL_SEARCH_ENDPOINT, window.location.origin);
		url.searchParams.set('artist', artistName);

		fetch(url)
			.then((res) => {
				if (!res.ok) throw new Error(`GetSongBPM API error: ${res.status}`);
				return res.json() as Promise<GsbSong[]>;
			})
			.then((data) => {
				dispatch({
					type: 'success',
					data: data.filter((s) =>
						epsilon != null
							? withinEpsilon(s.tempo, tempo, epsilon)
							: s.tempo === tempo,
					),
				});
			})
			.catch((err: unknown) => {
				dispatch({
					type: 'error',
					error: err instanceof Error ? err.message : 'Unknown error',
				});
			});
	}, [artistId, artistName, tempo, epsilon]);

	return {
		songs: state.data,
		loading: state.status === 'loading',
		error: state.error,
	};
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
