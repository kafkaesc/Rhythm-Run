'use client';

import { useReducer, useEffect, useState } from 'react';
import { initialState, reducer } from '@/hooks/api/asyncReducer';
import { useSessionStatus } from '@/hooks/useSessionStatus';
import { clamp, MS_PER_SECOND } from '@/lib/math';
import {
	SPOTIFY_BASE_URL,
	SPOTIFY_CURRENT_USER_ENDPOINT,
	SPOTIFY_PLAYLISTS_ENDPOINT,
	SPOTIFY_SEARCH_ENDPOINT,
	SPOTIFY_SEARCH_LIMIT,
	SPOTIFY_TOP_ARTISTS_ENDPOINT,
	SPOTIFY_TOP_ARTIST_LIMIT,
} from '@/lib/spotify';
import { Track } from '@/models/rhythmRun';
import {
	SpotifyArtist,
	SpotifyArtistResult,
	SpotifyPlaylist,
	SpotifyPlaylistAddTracksResult,
	SpotifyPlaylistResult,
	SpotifyTrack,
	SpotifyTrackResult,
	SpotifyUser,
	SpotifyUserResult,
} from '@/models/spotify';

const LOCAL_TOKEN_ENDPOINT = '/api/spotify/token';

/**
 * Returns the user's Spotify access token, or null if there's no login.
 * Used to prioritize user token requests over the Rhythm Run token.
 */
function useSpotifyToken(): string | null {
	const { session } = useSessionStatus();
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
				// Safety window of 60 seconds for tokens that are near-expired
				expiresAt: Date.now() + (expiresIn - 60) * MS_PER_SECOND,
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
				// Build the URL
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
				dispatch({ type: 'success', data: data.artists.items });
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
 * Calls the Spotify API for the logged-in user's profile.
 * Returns "user: null" if not logged in.
 *
 * @returns A {@link SpotifyUserResult}
 */
export function useSpotifyCurrentUser(): SpotifyUserResult {
	const [state, dispatch] = useReducer(
		reducer<SpotifyUser>,
		initialState<SpotifyUser>(),
	);
	const token = useSpotifyToken();

	useEffect(() => {
		if (!token) {
			dispatch({ type: 'clear' });
			return;
		}

		dispatch({ type: 'fetch' });

		const controller = new AbortController();

		// Call the Spotify API with the access token
		fetch(SPOTIFY_CURRENT_USER_ENDPOINT, {
			signal: controller.signal,
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => {
				// Check for errors before returning a JSON promise of the data
				if (!res.ok) throw new Error(`Spotify API error: ${res.status}`);
				return res.json() as Promise<SpotifyUser>;
			})
			.then((data) => {
				// Return the fetched user
				dispatch({ type: 'success', data });
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
	}, [token]);

	return {
		user: state.data,
		loading: state.status === 'loading',
		error: state.error,
	};
}

/**
 * Returns a function to add tracks to a Spotify playlist.
 * Requires the user to be authenticated.
 *
 * @returns A {@link SpotifyPlaylistAddTracksResult}
 */
export function useSpotifyPlaylistAddTracks(): SpotifyPlaylistAddTracksResult {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const token = useSpotifyToken();

	async function addTracks(
		playlistId: string,
		trackUris: string[],
	): Promise<boolean> {
		if (!token) {
			setError('Not authenticated');
			return false;
		}

		setLoading(true);
		setError(null);

		try {
			// Call the Spotify API with the access token
			const res = await fetch(
				`${SPOTIFY_BASE_URL}/playlists/${playlistId}/items`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ uris: trackUris }),
				},
			);
			// Check for errors
			if (!res.ok) throw new Error(`Spotify API error: ${res.status}`);
			return true;
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Unknown error');
			return false;
		} finally {
			setLoading(false);
		}
	}

	return { addTracks, loading, error };
}

/**
 * Calls the Spotify API for the logged-in Spotify user's playlists.
 * Returns "playlists: null" if not logged in.
 *
 * @param limit - Optional, default 50, number of playlists to return, clamped to [1–50]
 * @returns A {@link SpotifyPlaylistResult}
 */
export function useSpotifyPlaylists(limit = 50): SpotifyPlaylistResult {
	const [state, dispatch] = useReducer(
		reducer<SpotifyPlaylist[]>,
		initialState<SpotifyPlaylist[]>(),
	);
	const token = useSpotifyToken();

	useEffect(() => {
		if (!token) {
			dispatch({ type: 'clear' });
			return;
		}

		dispatch({ type: 'fetch' });

		const controller = new AbortController();

		const clampedLimit = String(clamp(limit, 1, 50));

		// Build the URI
		const url = new URL(SPOTIFY_PLAYLISTS_ENDPOINT);
		url.searchParams.set('limit', clampedLimit);

		// Call the Spotify API with the access token
		fetch(url, {
			signal: controller.signal,
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => {
				// Check for errors before returning a JSON promise of the data
				if (!res.ok) throw new Error(`Spotify API error: ${res.status}`);
				return res.json() as Promise<{ items: SpotifyPlaylist[] }>;
			})
			.then((data) => {
				// Return the fetched playlists
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
	}, [token, limit]);

	return {
		playlists: state.data,
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
export function useSpotifyTopArtistsApi(
	limit = 10,
	recent = false,
): SpotifyArtistResult {
	const [state, dispatch] = useReducer(
		reducer<SpotifyArtist[]>,
		initialState<SpotifyArtist[]>(),
	);
	const token = useSpotifyToken();

	useEffect(() => {
		if (!token) {
			dispatch({ type: 'clear' });
			return;
		}

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

/**
 * Returns a function that looks up Spotify track URIs from Track objects
 * by searching Spotify for each track by title and artist. Tracks that
 * can't be matched are silently skipped.
 *
 * @returns An object with a resolveUris function
 */
export function useSpotifyTrackLookup() {
	const token = useSpotifyToken();

	async function resolveUris(
		tracks: Track[],
	): Promise<{ uris: string[]; matched: number }> {
		const accessToken = token ?? (await getCachedToken());
		const uris: string[] = [];

		for (const track of tracks) {
			if (!track.artists[0]) continue;

			// Build the URL
			const query = `track:${track.title} artist:${track.artists[0]}`;
			const url = new URL(SPOTIFY_SEARCH_ENDPOINT);
			url.searchParams.set('q', query);
			url.searchParams.set('type', 'track');
			url.searchParams.set('limit', '1');

			try {
				// Call the Spotify API with the access token
				const res = await fetch(url, {
					headers: { Authorization: `Bearer ${accessToken}` },
				});

				// Check for errors
				if (!res.ok) continue;

				// Take the first result from the Spotify response and add it to the URI array
				const data = (await res.json()) as {
					tracks: { items: SpotifyTrack[] };
				};
				const first = data.tracks.items[0];
				if (first) uris.push(`spotify:track:${first.id}`);
			} catch {
				// Skip tracks that fail to resolve
			}
		}

		return { uris, matched: uris.length };
	}

	return { resolveUris };
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
				// Build the URL
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
				dispatch({ type: 'success', data: data.tracks.items });
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
