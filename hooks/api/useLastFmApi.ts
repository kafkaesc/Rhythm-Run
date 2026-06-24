'use client';

import { useAsyncData } from '@/hooks/api/useAsyncData';
import { fetchLocalJson } from '@/lib/api-fetch';
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
 *
 * @param artist - Artist name to search for
 * @returns A {@link LfmArtistResult}
 */
export function useLastFmArtistSearch(artist: string | null): LfmArtistResult {
	const { data, loading, error } = useAsyncData<LfmArtist[]>(
		artist
			? (signal) =>
					fetchLocalJson(
						LOCAL_ARTIST_SEARCH_ENDPOINT,
						{ artist },
						signal,
						'Last.fm API',
					)
			: null,
		[artist],
	);

	return { artists: data, loading, error };
}

/**
 * Calls the Last.fm API for the top tracks of an artist.
 * Accepts either an artist MBID or name; MBID is preferred when available.
 *
 * @param mbid - MusicBrainz ID of the artist
 * @param artist - Artist name (used only if mbid is not provided)
 * @returns A {@link LfmTopTrackResult}
 */
export function useLastFmArtistTopTracks(
	mbid: string | null,
	artist: string | null = null,
): LfmTopTrackResult {
	const { data, loading, error } = useAsyncData<LfmTopTrack[]>(
		mbid || artist
			? (signal) =>
					fetchLocalJson(
						LOCAL_ARTIST_TOP_TRACKS_ENDPOINT,
						mbid ? { mbid } : { artist: artist as string },
						signal,
						'Last.fm API',
					)
			: null,
		[mbid, artist],
	);

	return { tracks: data, loading, error };
}

/**
 * Calls the Last.fm API to search for tracks matching a title.
 *
 * @param track - Track title to search for
 * @param artist - Optional artist name to narrow results
 * @returns A {@link LfmTrackSearchResult}
 */
export function useLastFmTrackSearch(
	track: string | null,
	artist: string | null = null,
): LfmTrackSearchResult {
	const { data, loading, error } = useAsyncData<LfmSearchTrack[]>(
		track
			? (signal) =>
					fetchLocalJson(
						LOCAL_TRACK_SEARCH_ENDPOINT,
						artist ? { track, artist } : { track },
						signal,
						'Last.fm API',
					)
			: null,
		[track, artist],
	);

	return { tracks: data, loading, error };
}
