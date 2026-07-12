'use client';

import { useReducer, useEffect, Dispatch } from 'react';
import {
	dispatchAsyncError,
	initialState,
	reducer,
} from '@/hooks/api/asyncReducer';
import { fetchLocalStream } from '@/lib/api-fetch';
import { DEFAULT_BPM } from '@/lib/constants';
import { readNdjsonStream } from '@/lib/ndjson';
import { isTrack } from '@/lib/track';
import { AsyncAction } from '@/models/async';
import { Track } from '@/models/rhythmRun';

const LOCAL_ARTIST_TRACKS_ENDPOINT = '/api/metamusic/artist-tracks';

/**
 * Streams artist tracks from the internal MetaMusic route, dispatching the
 * growing track list on each record and a final success when the stream ends.
 * Intentional aborts are ignored, any other failure is dispatched as an error.
 *
 * @param mbidList - Artist MBIDs to request tracks for
 * @param tempo - Target tempo (BPM) as a query string value
 * @param epsilon - Allowed tempo tolerance as a query string value
 * @param signal - AbortSignal that cancels the in-flight stream
 * @param dispatch - Async reducer dispatch driving the hook's state
 */
async function streamArtistTracks(
	mbidList: string[],
	tempo: string,
	epsilon: string,
	signal: AbortSignal,
	dispatch: Dispatch<AsyncAction<Track[]>>,
) {
	try {
		const stream = await fetchLocalStream(
			LOCAL_ARTIST_TRACKS_ENDPOINT,
			{ artistMbid: mbidList, epsilon, tempo },
			signal,
			'MetaMusic API',
		);

		// Validate and dispatch each track as it streams in, skipping any record
		// that does not match the Track shape
		const tracks: Track[] = [];
		for await (const record of readNdjsonStream<unknown>(stream)) {
			if (!isTrack(record)) {
				console.warn('Skipping non-Track record from MetaMusic stream:', record);
				continue;
			}

			tracks.push(record);
			dispatch({ data: [...tracks], type: 'streaming' });
		}

		dispatch({ data: [...tracks], type: 'success' });
	} catch (err: unknown) {
		dispatchAsyncError(err, dispatch);
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
	const FALLBACK_EPSILON = 0;
	const FALLBACK_TEMPO = DEFAULT_BPM;

	useEffect(() => {
		// If there are no MBIDs, return immediately
		if (!mbidKey) {
			dispatch({ type: 'clear' });
			return;
		}

		dispatch({ type: 'fetch' });
		const controller = new AbortController();

		// Start streaming, sending each MBID as a separate param plus tempo and epsilon
		streamArtistTracks(
			mbidList,
			String(tempo ?? FALLBACK_TEMPO),
			String(epsilon ?? FALLBACK_EPSILON),
			controller.signal,
			dispatch,
		);

		return () => controller.abort();
		// eslint-disable-next-line react-hooks/exhaustive-deps -- mbidKey is a stable string proxy for mbidList
	}, [mbidKey, tempo, epsilon]);

	return {
		tracks: state.data,
		done: state.status === 'success',
		loading: state.status === 'loading',
		streaming: state.status === 'streaming',
		error: state.error,
	};
}
