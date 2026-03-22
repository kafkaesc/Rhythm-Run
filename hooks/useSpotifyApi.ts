'use client';

import { useReducer, useEffect } from 'react';
import { SpotifyTrack } from '@/models/spotifyApiResponses';
import { AsyncState, AsyncAction } from '@/models/async';

const MILLISECONDS_IN_SECOND = 1000; // https://en.wikipedia.org/wiki/Millisecond

// Spotify API Endpoints, https://developer.spotify.com/documentation/web-api
const LOCAL_TOKEN_ENDPOINT = '/api/spotify/token';
const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';
const SPOTIFY_SEARCH_ENDPOINT = `${SPOTIFY_BASE_URL}/search`;

// Endpoint parameters
const SPOTIFY_SEARCH_LIMIT = '10'; // Spotify API won't allow more than 10

// Contains a cached Spotify access token and its expiration time,
// null => no token yet or expired token was flushed
let tokenCache: { token: string; expiresAt: number } | null = null;

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

// Initial state for an async fetch is idling with no data or error
const initialState: AsyncState<SpotifyTrack[]> = {
	status: 'idle',
	data: null,
	error: null,
};

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

	throw new Error('Unhandled action type');
}

/**
 * Calls the Spotify API to search for tracks matching the given query.
 * @param query - The search string to look up on Spotify.
 * @returns An object containing the fetched `tracks`, a `loading` boolean, and an `error` string if the request failed.
 */
export function useSpotifyTrackSearch(query: string) {
	const [state, dispatch] = useReducer(reducer<SpotifyTrack[]>, initialState);

	useEffect(() => {
		if (!query) return;

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
