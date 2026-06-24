'use client';

import { useAsyncData } from '@/hooks/api/useAsyncData';
import { fetchLocalJson } from '@/lib/api-fetch';
import {
	MbArtist,
	MbArtistResult,
	MbTrack,
	MbTrackResult,
} from '@/models/musicBrainz';

// MusicBrainz API, https://musicbrainz.org/doc/MusicBrainz_API
const LOCAL_ARTIST_ENDPOINT = '/api/musicbrainz/artist';
const LOCAL_TRACK_ENDPOINT = '/api/musicbrainz/recording';

/**
 * Calls the MusicBrainz API to search for artists matching a name.
 *
 * @param artist - Artist name to search for
 * @returns A {@link MbArtistResult}
 */
export function useMusicBrainzArtistSearch(
	artist: string | null,
): MbArtistResult {
	const { data, loading, error } = useAsyncData<MbArtist[]>(
		artist
			? (signal) =>
					fetchLocalJson(
						LOCAL_ARTIST_ENDPOINT,
						{ artist },
						signal,
						'MusicBrainz API',
					)
			: null,
		[artist],
	);

	return { artists: data, loading, error };
}

/**
 * Calls the MusicBrainz API to search for tracks matching a title.
 *
 * @param track - Track title to search for
 * @returns A {@link MbTrackResult}
 */
export function useMusicBrainzTrackSearch(track: string | null): MbTrackResult {
	const { data, loading, error } = useAsyncData<MbTrack[]>(
		track
			? (signal) =>
					fetchLocalJson(
						LOCAL_TRACK_ENDPOINT,
						{ track },
						signal,
						'MusicBrainz API',
					)
			: null,
		[track],
	);

	return { tracks: data, loading, error };
}
