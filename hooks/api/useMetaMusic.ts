'use client';

import { useReducer, useEffect } from 'react';
import { initialState, reducer } from '@/hooks/api/asyncReducer';
import { Track } from '@/models/rhythmRun';

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
	const DEFAULT_EPSILON = 10;
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
				if (!res.ok) {
					throw new Error(`MetaMusic API error: ${res.status}`);
				}

				const reader = res.body?.getReader();
				if (!reader) {
					throw new Error('No response body');
				}

				const decoder = new TextDecoder();
				let buffer = '';
				const tracks: Track[] = [];

				while (true) {
					const { done, value } = await reader.read();
					if (done) {
						break;
					}

					buffer += decoder.decode(value, { stream: true });
					const lines = buffer.split('\n');
					buffer = lines.pop() ?? '';

					for (const line of lines) {
						if (!line.trim()) {
							continue;
						}
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
				if ((err as Error).name === 'AbortError') {
					return;
				}
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
