'use client';

import { useAsyncData } from '@/hooks/api/useAsyncData';
import { fetchLocalJson } from '@/lib/api-fetch';
import {
	GsbArtist,
	GsbArtistResult,
	GsbTrack,
	GsbTrackResult,
	GsbTempo,
	GsbTempoResult,
} from '@/models/getSongBpm';

// GetSongBPM API, https://getsongbpm.com/api
const LOCAL_ARTIST_ENDPOINT = '/api/gsb/artist';
const LOCAL_TRACK_ENDPOINT = '/api/gsb/song';
const LOCAL_TEMPO_ENDPOINT = '/api/gsb/tempo';

/**
 * Calls the GetSongBPM API to search for artists matching a name.
 *
 * @param artist - Artist name to search for.
 * @returns A {@link GsbArtistResult}
 */
export function useGsbArtistSearch(artist: string | null): GsbArtistResult {
	const { data, loading, error } = useAsyncData<GsbArtist[]>(
		artist
			? (signal) =>
					fetchLocalJson(
						LOCAL_ARTIST_ENDPOINT,
						{ artist },
						signal,
						'GetSongBPM API',
					)
			: null,
		[artist],
	);

	return { artists: data, loading, error };
}

/**
 * Calls the GetSongBPM API to search for tracks matching a title.
 *
 * @param track - Track title to search for.
 * @returns A {@link GsbTrackResult}
 */
export function useGsbTrackSearch(track: string | null): GsbTrackResult {
	const { data, loading, error } = useAsyncData<GsbTrack[]>(
		track
			? (signal) =>
					fetchLocalJson(
						LOCAL_TRACK_ENDPOINT,
						{ song: track },
						signal,
						'GetSongBPM API',
					)
			: null,
		[track],
	);

	return { tracks: data, loading, error };
}

/**
 * Calls the GetSongBPM API to search for tracks matching a target BPM.
 *
 * @param bpm - Target tempo in beats per minute.
 * @returns A {@link GsbTempoResult}
 */
export function useGsbTempoSearch(bpm: number | null): GsbTempoResult {
	const { data, loading, error } = useAsyncData<GsbTempo[]>(
		bpm
			? (signal) =>
					fetchLocalJson(
						LOCAL_TEMPO_ENDPOINT,
						{ bpm: String(bpm) },
						signal,
						'GetSongBPM API',
					)
			: null,
		[bpm],
	);

	return { tracks: data, loading, error };
}
