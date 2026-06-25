import { GsbArtist, GsbTrack } from '@/models/getSongBpm';
import { LfmArtist, LfmSearchTrack, LfmTopTrack } from '@/models/lastFm';
import { SpotifyArtist, SpotifyTrack } from '@/models/spotify';
import { Artist, Track } from '@/models/rhythmRun';
import { MbArtist, MbTrack } from '@/models/musicBrainz';

/**
 * Normalizes a {@link GsbArtist} from the GetSongBPM API into the common {@link Artist} shape
 *
 * @param artist - {@link GsbArtist} object
 * @returns A normalized {@link Artist} object matching the argument
 */
export function normalizeGsbArtist(artist: GsbArtist): Artist {
	return {
		id: artist.id,
		getSongBpmId: artist.id,
		mbid: artist.mbid,
		name: artist.name,
		genres: artist.genres ?? [],
	};
}

/**
 * Normalizes a {@link GsbTrack} from the GetSongBPM API into the common {@link Track} shape
 *
 * @param track - {@link GsbTrack} object
 * @returns A normalized {@link Track} object matching the argument
 */
export function normalizeGsbTrack(track: GsbTrack): Track {
	return {
		id: track.id,
		getSongBpmId: track.id,
		title: track.title,
		artists: [track.artist.name],
		bpm: Number.parseInt(track.tempo),
		gsbDanceability: track.danceability,
	};
}

/**
 * Normalizes a {@link LfmArtist} from the Last.fm API into the common {@link Artist} shape
 *
 * @param artist - {@link LfmArtist} object
 * @returns A normalized {@link Artist} object matching the argument
 */
export function normalizeLfmArtist(artist: LfmArtist): Artist {
	return {
		id: artist.mbid || artist.name,
		mbid: artist.mbid || undefined,
		name: artist.name,
		genres: [],
	};
}

/**
 * Normalizes a {@link LfmSearchTrack} from the Last.fm API into the common {@link Track} shape
 *
 * @param track - {@link LfmSearchTrack} object
 * @returns A normalized {@link Track} object matching the argument
 */
export function normalizeLfmSearchTrack(track: LfmSearchTrack): Track {
	return {
		id: track.mbid || `${track.name}-${track.artist}`,
		mbid: track.mbid || undefined,
		title: track.name,
		artists: [track.artist],
	};
}

/**
 * Normalizes a {@link LfmTopTrack} from the Last.fm API into the common {@link Track} shape
 *
 * @param track - {@link LfmTopTrack} object
 * @returns A normalized {@link Track} object matching the argument
 */
export function normalizeLfmTopTrack(track: LfmTopTrack): Track {
	return {
		id: track.mbid || track.name,
		mbid: track.mbid || undefined,
		title: track.name,
		artists: [track.artist.name],
	};
}

/**
 * Normalizes a {@link MbArtist} from the MusicBrainz API into the common {@link Artist} shape
 *
 * @param artist - {@link MbArtist} object
 * @returns A normalized {@link Artist} object matching the argument
 */
export function normalizeMbArtist(artist: MbArtist): Artist {
	return {
		id: artist.id,
		mbid: artist.id,
		name: artist.name,
		genres: [],
	};
}

/**
 * Normalizes a {@link MbTrack} from the MusicBrainz API into the common {@link Track} shape
 *
 * @param track - {@link MbTrack} object
 * @returns A normalized {@link Track} object matching the argument
 */
export function normalizeMbTrack(track: MbTrack): Track {
	return {
		id: track.id,
		title: track.title,
		artists: [
			track['artist-credit'].map((c) => c.name + (c.joinphrase ?? '')).join(''),
		],
	};
}

/**
 * Normalizes a {@link SpotifyArtist} from the Spotify API into the common {@link Artist} shape
 *
 * @param artist - {@link SpotifyArtist} object
 * @returns A normalized {@link Artist} object matching the argument
 */
export function normalizeSpotifyArtist(artist: SpotifyArtist): Artist {
	return {
		id: artist.id,
		spotifyId: artist.id,
		name: artist.name,
		genres: artist.genres ?? [],
	};
}

/**
 * Normalizes a {@link SpotifyTrack} from the Spotify API into the common {@link Track} shape
 *
 * @param track - {@link SpotifyTrack} object
 * @returns A normalized {@link Track} object matching the argument
 */
export function normalizeSpotifyTrack(track: SpotifyTrack): Track {
	return {
		id: track.id,
		spotifyId: track.id,
		title: track.name,
		artists: track.artists.map((ar) => ar.name),
	};
}
