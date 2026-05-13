'use client';

import { useReducer, useEffect, Dispatch } from 'react';
import { initialState, reducer } from '@/hooks/api/asyncReducer';
import { AsyncAction } from '@/models/async';
import { Track } from '@/models/rhythmRun';

const LOCAL_ARTIST_TRACKS_ENDPOINT = '/api/metamusic/artist-tracks';

async function streamArtistTracks(
	url: URL,
	abortSignal: AbortSignal,
	dispatch: Dispatch<AsyncAction<Track[]>>,
) {
	try {
		// Fetch the stream, throwing an error if not Ok
		const res = await fetch(url, { signal: abortSignal });
		if (!res.ok) throw new Error(`MetaMusic API error: ${res.status}`);

		// Create reader on the response body for line-by-line streaming
		const reader = res.body?.getReader();
		if (!reader) throw new Error('No response body');

		// Setup to run the stream
		const decoder = new TextDecoder();
		let buffer = '';
		const tracks: Track[] = [];

		while (true) {
			// Read the next chunk from the stream, if done break
			const { done, value } = await reader.read();
			if (done) break;

			// Decode the chunk, split by newline, place the remainder in buffer
			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split('\n');
			buffer = lines.pop() ?? '';

			// Parse each complete line as a Track and dispatch it
			for (const line of lines) {
				// Skip empty lines
				if (!line.trim()) continue;

				// Parse the line into JSON and onto the tracks array
				try {
					const track = JSON.parse(line) as Track;
					tracks.push(track);
					dispatch({ type: 'streaming', data: [...tracks] });
				} catch {
					console.warn('Skipping malformed line from MetaMusic stream:', line);
				}
			}
		}

		dispatch({ type: 'success', data: [...tracks] });
	} catch (err: unknown) {
		// AbortError is intentional so return silently
		if ((err as Error).name === 'AbortError') return;

		dispatch({
			type: 'error',
			error: err instanceof Error ? err.message : 'Unknown error',
		});
	}
}

export function useMetaMusicArtistTempo(
	mbidList: string[],
	tempo: number | null = null,
	epsilon: number | null = null,
) {
	const [state, dispatch] = useReducer(
		reducer<Track[]>,
		initialState<Track[]>(),
	);

	// Join the MBIDs into a string to use as a stable state dependency
	const mbidKey = mbidList.join(',');

	// Fallback values because we really expect these in the request
	const FALLBACK_EPSILON = 4;
	const FALLBACK_TEMPO = 160;

	useEffect(() => {
		// If there are no MBIDs, return immediately
		if (!mbidKey) {
			dispatch({ type: 'clear' });
			return;
		}

		dispatch({ type: 'fetch' });
		const controller = new AbortController();

		// Build the request URL with each MBID as a separate param, then tempo and epsilon
		const url = new URL(LOCAL_ARTIST_TRACKS_ENDPOINT, window.location.origin);
		mbidList.forEach((mbid) => url.searchParams.append('artistMbid', mbid));
		url.searchParams.set('tempo', String(tempo ?? FALLBACK_TEMPO));
		url.searchParams.set('epsilon', String(epsilon ?? FALLBACK_EPSILON));

		// Start streaming
		streamArtistTracks(url, controller.signal, dispatch);

		return () => controller.abort();
		// eslint-disable-next-line react-hooks/exhaustive-deps -- mbidKey is a stable string proxy for mbidList
	}, [mbidKey, tempo, epsilon]);

	return {
		tracks: state.data,
		loading: state.status === 'loading',
		streaming: state.status === 'streaming',
		error: state.error,
	};
}
