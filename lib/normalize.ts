import { GsbArtist, GsbTrack } from '@/models/getSongBpm';
import { LfmArtist, LfmSearchTrack, LfmTopTrack } from '@/models/lastFm';
import { SpotifyArtist, SpotifyTrack } from '@/models/spotify';
import { Artist, Track } from '@/models/rhythmRun';
import { MbArtist, MbTrack } from '@/models/musicBrainz';

/** Normalizes a GsbArtist from the GetSongBPM API into the common Artist shape */
export function normalizeGsbArtist(artist: GsbArtist): Artist {
	return {
		id: artist.id,
		getSongBpmId: artist.id,
		mbid: artist.mbid,
		name: artist.name,
		genres: artist.genres ?? [],
	};
}

/** Normalizes a GsbTrack from the GetSongBPM API into the common Track shape */
export function normalizeGsbTrack(track: GsbTrack): Track {
	return {
		id: track.id,
		getSongBpmId: track.id,
		title: track.title,
		artists: [track.artist.name],
		bpm: parseInt(track.tempo),
		gsbDanceability: track.danceability,
	};
}

/** Normalizes a LfmArtist from the Last.fm API into the common Artist shape */
export function normalizeLfmArtist(artist: LfmArtist): Artist {
	return {
		id: artist.mbid || artist.name,
		mbid: artist.mbid || undefined,
		name: artist.name,
		genres: [],
	};
}

/** Normalizes a LfmSearchTrack from the Last.fm API into the common Track shape */
export function normalizeLfmSearchTrack(track: LfmSearchTrack): Track {
	return {
		id: track.mbid || `${track.name}-${track.artist}`,
		mbid: track.mbid || undefined,
		title: track.name,
		artists: [track.artist],
	};
}

/** Normalizes a LfmTopTrack from the Last.fm API into the common Track shape */
export function normalizeLfmTopTrack(track: LfmTopTrack): Track {
	return {
		id: track.mbid || track.name,
		mbid: track.mbid || undefined,
		title: track.name,
		artists: [track.artist.name],
	};
}

/** Normalizes a MbArtist from the MusicBrainz API into the common Artist shape */
export function normalizeMbArtist(artist: MbArtist): Artist {
	return {
		id: artist.id,
		mbid: artist.id,
		name: artist.name,
		genres: [],
	};
}

/** Normalizes a MbTrack from the MusicBrainz API into the common Track shape */
export function normalizeMbTrack(track: MbTrack): Track {
	return {
		id: track.id,
		title: track.title,
		artists: [
			track['artist-credit'].map((c) => c.name + (c.joinphrase ?? '')).join(''),
		],
	};
}

/** Normalizes a SpotifyArtist from the Spotify API into the common Artist shape */
export function normalizeSpotifyArtist(artist: SpotifyArtist): Artist {
	return {
		id: artist.id,
		spotifyId: artist.id,
		name: artist.name,
		genres: artist.genres,
	};
}

/** Normalizes a SpotifyTrack from the Spotify API into the common Track shape */
export function normalizeSpotifyTrack(track: SpotifyTrack): Track {
	return {
		id: track.id,
		spotifyId: track.id,
		title: track.name,
		artists: track.artists.map((ar) => ar.name),
	};
}
