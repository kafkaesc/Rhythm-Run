'use client';

import { useReducer, useEffect } from 'react';
import { initialState, reducer } from '@/hooks/api/asyncReducer';
import {
	LfmArtist,
	LfmArtistResult,
	LfmTopTrack,
	LfmTopTrackResult,
	LfmSearchTrack,
	LfmTrackSearchResult,
} from '@/models/lastFm';

// Last.fm API, https://www.last.fm/api
const LOCAL_ARTIST_SEARCH_ENDPOINT = '/api/lastfm/artist-search';
const LOCAL_ARTIST_TOP_TRACKS_ENDPOINT = '/api/lastfm/artist-top-tracks';
const LOCAL_TRACK_SEARCH_ENDPOINT = '/api/lastfm/track-search';

/**
 * Calls the Last.fm API to search for artists matching a name.
 * @param artist - Artist name to search for.
 * @returns A {@link LfmArtistResult}
 */
export function useLastFmArtistSearch(artist: string | null): LfmArtistResult {
	const [state, dispatch] = useReducer(
		reducer<LfmArtist[]>,
		initialState<LfmArtist[]>(),
	);

	useEffect(() => {
		if (!artist) {
			dispatch({ type: 'clear' });
			return;
		}

		dispatch({ type: 'fetch' });

		const url = new URL(LOCAL_ARTIST_SEARCH_ENDPOINT, window.location.origin);
		url.searchParams.set('artist', artist);

		fetch(url)
			.then((res) => {
				if (!res.ok) {
					throw new Error(`Last.fm API error: ${res.status}`);
				}
				return res.json() as Promise<LfmArtist[]>;
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
 * Calls the Last.fm API for the top tracks of an artist.
 * Accepts either an artist MBID or name; MBID is preferred when available.
 * @param mbid - MusicBrainz ID of the artist
 * @param artist - Artist name (used only if mbid is not provided)
 * @returns A {@link LfmTopTrackResult}
 */
export function useLastFmArtistTopTracks(
	mbid: string | null,
	artist: string | null = null,
): LfmTopTrackResult {
	const [state, dispatch] = useReducer(
		reducer<LfmTopTrack[]>,
		initialState<LfmTopTrack[]>(),
	);

	useEffect(() => {
		if (!mbid && !artist) {
			dispatch({ type: 'clear' });
			return;
		}

		dispatch({ type: 'fetch' });

		const url = new URL(
			LOCAL_ARTIST_TOP_TRACKS_ENDPOINT,
			window.location.origin,
		);
		if (mbid) {
			url.searchParams.set('mbid', mbid);
		} else if (artist) {
			url.searchParams.set('artist', artist);
		}

		fetch(url)
			.then((res) => {
				if (!res.ok) {
					throw new Error(`Last.fm API error: ${res.status}`);
				}
				return res.json() as Promise<LfmTopTrack[]>;
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
	}, [mbid, artist]);

	return {
		tracks: state.data,
		loading: state.status === 'loading',
		error: state.error,
	};
}

/**
 * Calls the Last.fm API to search for tracks matching a title.
 *
 * @param track - Track title to search for.
 * @param artist - Optional artist name to narrow results.
 * @returns A {@link LfmTrackSearchResult}
 */
export function useLastFmTrackSearch(
	track: string | null,
	artist: string | null = null,
): LfmTrackSearchResult {
	const [state, dispatch] = useReducer(
		reducer<LfmSearchTrack[]>,
		initialState<LfmSearchTrack[]>(),
	);

	useEffect(() => {
		if (!track) {
			dispatch({ type: 'clear' });
			return;
		}

		dispatch({ type: 'fetch' });

		const url = new URL(LOCAL_TRACK_SEARCH_ENDPOINT, window.location.origin);
		url.searchParams.set('track', track);
		if (artist) {
			url.searchParams.set('artist', artist);
		}

		fetch(url)
			.then((res) => {
				if (!res.ok) {
					throw new Error(`Last.fm API error: ${res.status}`);
				}
				return res.json() as Promise<LfmSearchTrack[]>;
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
	}, [track, artist]);

	return {
		tracks: state.data,
		loading: state.status === 'loading',
		error: state.error,
	};
}
