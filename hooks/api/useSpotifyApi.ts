'use client';

import { useReducer, useEffect } from 'react';
import {
	SpotifyArtist,
	SpotifyArtistResult,
	SpotifyTrack,
	SpotifyTrackResult,
} from '@/models/spotify';
import { AsyncState, AsyncAction } from '@/models/async';

const MILLISECONDS_IN_SECOND = 1000; // https://en.wikipedia.org/wiki/Millisecond

// Spotify API Endpoints, https://developer.spotify.com/documentation/web-api
const LOCAL_TOKEN_ENDPOINT = '/api/spotify/token';
const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';
const SPOTIFY_SEARCH_ENDPOINT = `${SPOTIFY_BASE_URL}/search`;
const SPOTIFY_RECOMMENDATIONS_ENDPOINT = `${SPOTIFY_BASE_URL}/recommendations`;

// Endpoint parameters
const SPOTIFY_SEARCH_LIMIT = '10'; // Spotify API won't allow more than 10
const SPOTIFY_RECOMMENDATIONS_LIMIT = '10'; // TODO: Test the limit when this is working

// Contains a cached Spotify access token and its expiration time,
// null => no token yet or expired token was flushed
let tokenCache: { token: string; expiresAt: number } | null = null;

/** Initial state for an async fetch is idling with no data or error */
function initialState<T>(): AsyncState<T> {
	return { status: 'idle', data: null, error: null };
}

/**
 * Returns a cached Spotify access token, or fetches a new one if the cache is empty or expired.
 * @returns A promise that resolves to a valid access token string.
 */
function getCachedToken(): Promise<string> {
	// If there is a cached token and it's not yet expired, return it
	if (tokenCache && Date.now() < tokenCache.expiresAt)
		return Promise.resolve(tokenCache.token);

	// Fetch a new token from Spotify
	return fetch(LOCAL_TOKEN_ENDPOINT)
		.then((res) => {
			if (!res.ok) throw new Error(`Token error: ${res.status}`);
			return res.json() as Promise<{ accessToken: string; expiresIn: number }>;
		})
		.then(({ accessToken, expiresIn }) => {
			// Cache the new token along with its expiration time
			tokenCache = {
				token: accessToken,
				expiresAt: Date.now() + expiresIn * MILLISECONDS_IN_SECOND,
			};
			return accessToken;
		});
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

/**
 * Calls the Spotify API to search for artists matching the query.
 * @param query - The search string to look up on Spotify.
 * @returns A {@link SpotifyArtistResult}
 */
export function useSpotifyArtistSearch(query: string): SpotifyArtistResult {
	const [state, dispatch] = useReducer(
		reducer<SpotifyArtist[]>,
		initialState<SpotifyArtist[]>(),
	);

	useEffect(() => {
		if (!query) {
			dispatch({ type: 'clear' });
			return;
		}

		dispatch({ type: 'fetch' });

		getCachedToken()
			.then((accessToken) => {
				const url = new URL(SPOTIFY_SEARCH_ENDPOINT);
				url.searchParams.set('q', query);
				url.searchParams.set('type', 'artist');
				url.searchParams.set('limit', SPOTIFY_SEARCH_LIMIT);

				return fetch(url, {
					headers: { Authorization: `Bearer ${accessToken}` },
				});
			})
			.then((res) => {
				if (!res.ok) throw new Error(`Spotify API error: ${res.status}`);
				return res.json() as Promise<{ artists: { items: SpotifyArtist[] } }>;
			})
			.then((data) => {
				return dispatch({ type: 'success', data: data.artists.items });
			})
			.catch((err: unknown) => {
				dispatch({
					type: 'error',
					error: err instanceof Error ? err.message : 'Unknown error',
				});
			});
	}, [query]);

	return {
		artists: state.data,
		loading: state.status === 'loading',
		error: state.error,
	};
}

/**
 * Calls the Spotify API to search for tracks matching the query.
 * @param query - The search string to look up on Spotify.
 * @returns A {@link SpotifyTrackResult}
 */
export function useSpotifyTrackSearch(query: string): SpotifyTrackResult {
	const [state, dispatch] = useReducer(
		reducer<SpotifyTrack[]>,
		initialState<SpotifyTrack[]>(),
	);

	useEffect(() => {
		if (!query) {
			dispatch({ type: 'clear' });
			return;
		}

		dispatch({ type: 'fetch' });

		getCachedToken()
			.then((accessToken) => {
				// Build the URI
				const url = new URL(SPOTIFY_SEARCH_ENDPOINT);
				url.searchParams.set('q', query);
				url.searchParams.set('type', 'track');
				url.searchParams.set('limit', SPOTIFY_SEARCH_LIMIT);

				// Call the Spotify API with the access token
				return fetch(url, {
					headers: { Authorization: `Bearer ${accessToken}` },
				});
			})
			.then((res) => {
				// Check for errors before returning a JSON promise of the data
				if (!res.ok) throw new Error(`Spotify API error: ${res.status}`);
				return res.json() as Promise<{ tracks: { items: SpotifyTrack[] } }>;
			})
			.then((data) => {
				// Return the fetched tracks
				return dispatch({ type: 'success', data: data.tracks.items });
			})
			.catch((err: unknown) => {
				dispatch({
					type: 'error',
					error: err instanceof Error ? err.message : 'Unknown error',
				});
			});
	}, [query]);

	return {
		tracks: state.data,
		loading: state.status === 'loading',
		error: state.error,
	};
}

type TempoSearchParams = {
	bpm?: number;
	seedTrack?: string;
	seedArtist?: string;
	seedGenre?: string;
};

/**
 * DEPRECATED BY SPOTIFY, WILL ONLY RETURN A 400 ERROR.
 * Calls the Spotify API for track recommendations matching a target BPM + seed data.
 * At least one seed (track ID, artist ID, or genre name) must be provided alongside a BPM.
 * Track IDs and artist IDs will need to be obtained by first searching
 * with {@link useSpotifyTrackSearch} or a similar method.
 * @param bpm - Target tempo in beats per minute (BPM)
 * @param seedArtist - A Spotify artist ID
 * @param seedGenre - A genre name
 * @param seedTrack - A Spotify track ID
 * @returns A {@link SpotifyTrackResult}
 */
export function useSpotifyTempoSearch({
	bpm,
	seedArtist,
	seedGenre,
	seedTrack,
}: TempoSearchParams): SpotifyTrackResult {
	const [state, dispatch] = useReducer(
		reducer<SpotifyTrack[]>,
		initialState<SpotifyTrack[]>(),
	);

	useEffect(() => {
		const hasSeed = seedTrack || seedArtist || seedGenre;

		if (!bpm || !hasSeed) return;

		dispatch({ type: 'fetch' });

		getCachedToken()
			.then((accessToken) => {
				// Build the URI
				const url = new URL(SPOTIFY_RECOMMENDATIONS_ENDPOINT);
				url.searchParams.set('target_tempo', String(bpm));
				url.searchParams.set('limit', SPOTIFY_RECOMMENDATIONS_LIMIT);
				if (seedTrack) url.searchParams.set('seed_tracks', seedTrack);
				if (seedArtist) url.searchParams.set('seed_artists', seedArtist);
				if (seedGenre) url.searchParams.set('seed_genres', seedGenre);

				// Call the Spotify API with the access token
				return fetch(url, {
					headers: { Authorization: `Bearer ${accessToken}` },
				});
			})
			.then((res) => {
				// Check for errors before returning a JSON promise of the data
				if (!res.ok) throw new Error(`Spotify API error: ${res.status}`);
				return res.json() as Promise<{ tracks: SpotifyTrack[] }>;
			})
			.then((data) => {
				// Return the fetched tracks
				return dispatch({ type: 'success', data: data.tracks });
			})
			.catch((err: unknown) => {
				dispatch({
					type: 'error',
					error: err instanceof Error ? err.message : 'Unknown error',
				});
			});
	}, [bpm, seedTrack, seedArtist, seedGenre]);

	return {
		tracks: state.data,
		loading: state.status === 'loading',
		error: state.error,
	};
}
