'use client';

import { useReducer, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { initialState, reducer } from '@/hooks/api/asyncReducer';
import { clamp } from '@/lib/math';
import {
	SPOTIFY_RECOMMENDATIONS_ENDPOINT,
	SPOTIFY_RECOMMENDATIONS_LIMIT,
	SPOTIFY_SEARCH_ENDPOINT,
	SPOTIFY_SEARCH_LIMIT,
	SPOTIFY_TOP_ARTISTS_ENDPOINT,
	SPOTIFY_TOP_ARTIST_LIMIT,
} from '@/lib/spotify';
import {
	SpotifyArtist,
	SpotifyArtistResult,
	SpotifyTrack,
	SpotifyTrackResult,
} from '@/models/spotify';

const MILLISECONDS_IN_SECOND = 1000; // https://en.wikipedia.org/wiki/Millisecond
const LOCAL_TOKEN_ENDPOINT = '/api/spotify/token';

/**
 * Returns the user's Spotify access token, or null if there's no login.
 * Used to prioritize user tokens requests over the Rhythm Run token.
 */
function useSpotifyToken(): string | null {
	const { data: session } = useSession();
	return session?.spotifyAccessToken ?? null;
}

// Contains a cached Spotify access token and its expiration time,
// null => no token yet or expired token was flushed
let tokenCache: { token: string; expiresAt: number } | null = null;

/**
 * Returns a cached Spotify access token, or fetches a new one if the cache is empty or expired.
 *
 * @returns A promise that resolves to a valid access token string.
 */
function getCachedToken(): Promise<string> {
	// If there is a cached token and it's not yet expired, return it
	if (tokenCache && Date.now() < tokenCache.expiresAt)
		return Promise.resolve(tokenCache.token);

	// Fetch a new token from Spotify
	return fetch(LOCAL_TOKEN_ENDPOINT, {
		headers: {
			'x-api-key': process.env.NEXT_PUBLIC_INTERNAL_API_KEY ?? '',
		},
	})
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
 * Calls the Spotify API to search for artists matching the query.
 *
 * @param query - The search string to look up on Spotify.
 * @returns A {@link SpotifyArtistResult}
 */
export function useSpotifyArtistSearch(query: string): SpotifyArtistResult {
	const [state, dispatch] = useReducer(
		reducer<SpotifyArtist[]>,
		initialState<SpotifyArtist[]>(),
	);
	const token = useSpotifyToken();

	useEffect(() => {
		if (!query) {
			dispatch({ type: 'clear' });
			return;
		}

		dispatch({ type: 'fetch' });

		const controller = new AbortController();

		(token ? Promise.resolve(token) : getCachedToken())
			.then((accessToken) => {
				// Build the URI
				const url = new URL(SPOTIFY_SEARCH_ENDPOINT);
				url.searchParams.set('q', query);
				url.searchParams.set('type', 'artist');
				url.searchParams.set('limit', SPOTIFY_SEARCH_LIMIT);

				// Call the Spotify API with the access token
				return fetch(url, {
					signal: controller.signal,
					headers: { Authorization: `Bearer ${accessToken}` },
				});
			})
			.then((res) => {
				// Check for errors before returning a JSON promise of the data
				if (!res.ok) throw new Error(`Spotify API error: ${res.status}`);
				return res.json() as Promise<{ artists: { items: SpotifyArtist[] } }>;
			})
			.then((data) => {
				// Return the fetched artists
				return dispatch({ type: 'success', data: data.artists.items });
			})
			.catch((err: unknown) => {
				// AbortError is intentional so return silently
				if ((err as Error).name === 'AbortError') return;
				dispatch({
					type: 'error',
					error: err instanceof Error ? err.message : 'Unknown error',
				});
			});

		return () => controller.abort();
	}, [query, token]);

	return {
		artists: state.data,
		loading: state.status === 'loading',
		error: state.error,
	};
}

/**
 * Calls the Spotify API to search for tracks matching the query.
 *
 * @param query - The search string to look up on Spotify.
 * @returns A {@link SpotifyTrackResult}
 */
export function useSpotifyTrackSearch(query: string): SpotifyTrackResult {
	const [state, dispatch] = useReducer(
		reducer<SpotifyTrack[]>,
		initialState<SpotifyTrack[]>(),
	);
	const token = useSpotifyToken();

	useEffect(() => {
		if (!query) {
			dispatch({ type: 'clear' });
			return;
		}

		dispatch({ type: 'fetch' });

		const controller = new AbortController();

		(token ? Promise.resolve(token) : getCachedToken())
			.then((accessToken) => {
				// Build the URI
				const url = new URL(SPOTIFY_SEARCH_ENDPOINT);
				url.searchParams.set('q', query);
				url.searchParams.set('type', 'track');
				url.searchParams.set('limit', SPOTIFY_SEARCH_LIMIT);

				// Call the Spotify API with the access token
				return fetch(url, {
					signal: controller.signal,
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
				// AbortError is intentional so return silently
				if ((err as Error).name === 'AbortError') return;
				dispatch({
					type: 'error',
					error: err instanceof Error ? err.message : 'Unknown error',
				});
			});

		return () => controller.abort();
	}, [query, token]);

	return {
		tracks: state.data,
		loading: state.status === 'loading',
		error: state.error,
	};
}

/**
 * Calls the Spotify API for the logged-in user's top artists by long-term listening history.
 * Requires the user to be authenticated; returns null artists if not logged in.
 *
 * @param limit - Optional, default 10, number of top artists to return, clamped to [1–50]
 * @param recent - Optional, default false, if true, returns recent top artists from the last 4 weeks
 * @returns A {@link SpotifyArtistResult}
 */
export function useSpotifyTopArtists(
	limit = 10,
	recent = false,
): SpotifyArtistResult {
	const [state, dispatch] = useReducer(
		reducer<SpotifyArtist[]>,
		initialState<SpotifyArtist[]>(),
	);
	const token = useSpotifyToken();

	useEffect(() => {
		if (!token) return;

		dispatch({ type: 'fetch' });

		const controller = new AbortController();

		if (limit < 1) console.warn('A value of 0 or less is not valid for limit');
		if (limit > SPOTIFY_TOP_ARTIST_LIMIT)
			console.warn(`Spotify won't allow a limit > ${SPOTIFY_TOP_ARTIST_LIMIT}`);

		const clampedLimit = String(clamp(limit, 1, SPOTIFY_TOP_ARTIST_LIMIT));
		const timeRange = recent ? 'short_term' : 'long_term';

		// Build the URI
		const url = new URL(SPOTIFY_TOP_ARTISTS_ENDPOINT);
		url.searchParams.set('limit', clampedLimit);
		url.searchParams.set('time_range', timeRange);

		// Call the Spotify API with the access token
		fetch(url, {
			signal: controller.signal,
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => {
				// Check for errors before returning a JSON promise of the data
				if (!res.ok) throw new Error(`Spotify API error: ${res.status}`);
				return res.json() as Promise<{ items: SpotifyArtist[] }>;
			})
			.then((data) => {
				// Return the fetched top artists
				dispatch({ type: 'success', data: data.items });
			})
			.catch((err: unknown) => {
				// AbortError is intentional so return silently
				if ((err as Error).name === 'AbortError') return;
				dispatch({
					type: 'error',
					error: err instanceof Error ? err.message : 'Unknown error',
				});
			});

		return () => controller.abort();
	}, [token, limit, recent]);

	return {
		artists: state.data,
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
 *
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

		const controller = new AbortController();

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
					signal: controller.signal,
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
				// AbortError is intentional so return silently
				if ((err as Error).name === 'AbortError') return;
				dispatch({
					type: 'error',
					error: err instanceof Error ? err.message : 'Unknown error',
				});
			});

		return () => controller.abort();
	}, [bpm, seedTrack, seedArtist, seedGenre]);

	return {
		tracks: state.data,
		loading: state.status === 'loading',
		error: state.error,
	};
}
