'use client';

import { useReducer, useEffect } from 'react';
import { Track } from '@/models/rhythmRun';
import { AsyncState, AsyncAction } from '@/models/async';

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

const LOCAL_ARTIST_TRACKS_ENDPOINT = '/api/metamusic/artist-tracks';

export function useMetaMusicArtistTempo(
	mbidList: string[],
	tempo: number | null = null,
	epsilon: number | null = null,
) {
	const [state, dispatch] = useReducer(
		reducer<Track[]>,
		initialState<Track[]>(),
	);

	// TODO: This is a wide epsilon while debugging, change to 0 when ready
	const DEFAULT_EPSILON = 40;
	const DEFAULT_TEMPO = 120;
	const mbidKey = mbidList.join(',');

	useEffect(() => {
		if (!mbidKey) {
			dispatch({ type: 'clear' });
			return;
		}

		dispatch({ type: 'fetch' });

		const controller = new AbortController();
		const url = new URL(LOCAL_ARTIST_TRACKS_ENDPOINT, window.location.origin);
		mbidKey
			.split(',')
			.forEach((mbid) => url.searchParams.append('artistMbid', mbid));
		url.searchParams.set('tempo', String(tempo ?? DEFAULT_TEMPO));
		url.searchParams.set('epsilon', String(epsilon ?? DEFAULT_EPSILON));

		(async () => {
			try {
				const res = await fetch(url, { signal: controller.signal });
				if (!res.ok) throw new Error(`MetaMusic API error: ${res.status}`);

				const reader = res.body?.getReader();
				if (!reader) throw new Error('No response body');

				const decoder = new TextDecoder();
				let buffer = '';
				const tracks: Track[] = [];

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					buffer += decoder.decode(value, { stream: true });
					const lines = buffer.split('\n');
					buffer = lines.pop() ?? '';

					for (const line of lines) {
						if (!line.trim()) continue;
						try {
							const track = JSON.parse(line) as Track;
							tracks.push(track);
							dispatch({ type: 'success', data: [...tracks] });
						} catch {
							// skip malformed line
						}
					}
				}
			} catch (err: unknown) {
				if ((err as Error).name === 'AbortError') return;
				dispatch({
					type: 'error',
					error: err instanceof Error ? err.message : 'Unknown error',
				});
			}
		})();

		return () => controller.abort();
	}, [mbidKey, tempo, epsilon]);

	return {
		tracks: state.data,
		loading: state.status === 'loading',
		error: state.error,
	};
}
