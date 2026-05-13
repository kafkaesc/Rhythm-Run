'use client';

import { useReducer, useEffect } from 'react';
import { initialState, reducer } from '@/hooks/api/asyncReducer';
import {
	GsbArtist,
	GsbArtistResult,
	GsbTrack,
	GsbTrackResult,
	GsbTempo,
	GsbTempoResult,
} from '@/models/getSongBpm';

// GetSongBPM API, https://getsongbpm.com/api
const LOCAL_ARTIST_ENDPOINT = '/api/gsb/artist';
const LOCAL_TRACK_ENDPOINT = '/api/gsb/song';
const LOCAL_TEMPO_ENDPOINT = '/api/gsb/tempo';

/**
 * Calls the GetSongBPM API to search for artists matching a name.
 *
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

		const controller = new AbortController();
		const url = new URL(LOCAL_ARTIST_ENDPOINT, window.location.origin);
		url.searchParams.set('artist', artist);

		fetch(url, {
			headers: {
				'x-api-key': process.env.NEXT_PUBLIC_INTERNAL_API_KEY ?? '',
			},
			signal: controller.signal,
		})
			.then((res) => {
				if (!res.ok) throw new Error(`GetSongBPM API error: ${res.status}`);
				return res.json() as Promise<GsbArtist[]>;
			})
			.then((data) => {
				dispatch({ type: 'success', data });
			})
			.catch((err: unknown) => {
				if ((err as Error).name === 'AbortError') return;
				dispatch({
					type: 'error',
					error: err instanceof Error ? err.message : 'Unknown error',
				});
			});

		return () => controller.abort();
	}, [artist]);

	return {
		artists: state.data,
		loading: state.status === 'loading',
		error: state.error,
	};
}

/**
 * Calls the GetSongBPM API to search for tracks matching a title.
 *
 * @param track - Track title to search for.
 * @returns A {@link GsbTrackResult}
 */
export function useGsbTrackSearch(track: string | null): GsbTrackResult {
	const [state, dispatch] = useReducer(
		reducer<GsbTrack[]>,
		initialState<GsbTrack[]>(),
	);

	useEffect(() => {
		if (!track) {
			dispatch({ type: 'clear' });
			return;
		}

		dispatch({ type: 'fetch' });

		const controller = new AbortController();
		const url = new URL(LOCAL_TRACK_ENDPOINT, window.location.origin);
		url.searchParams.set('song', track);

		fetch(url, {
			headers: {
				'x-api-key': process.env.NEXT_PUBLIC_INTERNAL_API_KEY ?? '',
			},
			signal: controller.signal,
		})
			.then((res) => {
				if (!res.ok) throw new Error(`GetSongBPM API error: ${res.status}`);
				return res.json() as Promise<GsbTrack[]>;
			})
			.then((data) => {
				dispatch({ type: 'success', data });
			})
			.catch((err: unknown) => {
				if ((err as Error).name === 'AbortError') return;
				dispatch({
					type: 'error',
					error: err instanceof Error ? err.message : 'Unknown error',
				});
			});

		return () => controller.abort();
	}, [track]);

	return {
		tracks: state.data,
		loading: state.status === 'loading',
		error: state.error,
	};
}

/**
 * Calls the GetSongBPM API to search for tracks matching a target BPM.
 *
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

		const controller = new AbortController();
		const url = new URL(LOCAL_TEMPO_ENDPOINT, window.location.origin);
		url.searchParams.set('bpm', String(bpm));

		fetch(url, {
			headers: {
				'x-api-key': process.env.NEXT_PUBLIC_INTERNAL_API_KEY ?? '',
			},
			signal: controller.signal,
		})
			.then((res) => {
				if (!res.ok) throw new Error(`GetSongBPM API error: ${res.status}`);
				return res.json() as Promise<GsbTempo[]>;
			})
			.then((data) => {
				dispatch({ type: 'success', data });
			})
			.catch((err: unknown) => {
				if ((err as Error).name === 'AbortError') return;
				dispatch({
					type: 'error',
					error: err instanceof Error ? err.message : 'Unknown error',
				});
			});

		return () => controller.abort();
	}, [bpm]);

	return {
		tracks: state.data,
		loading: state.status === 'loading',
		error: state.error,
	};
}
