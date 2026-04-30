import { GsbArtist, GsbSong } from '@/models/getSongBpm';
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

/** Normalizes an array of GsbArtist objects from the GetSongBPM API
 * into the common Artist shape */
export function normalizeGsbArtists(artists: GsbArtist[]): Artist[] {
	return artists.map(normalizeGsbArtist);
}

/** Normalizes a GsbSong from the GetSongBPM API into the common Track shape */
export function normalizeGsbTrack(track: GsbSong): Track {
	return {
		id: track.id,
		getSongBpmId: track.id,
		title: track.title,
		artists: [track.artist.name],
		bpm: parseInt(track.tempo),
	};
}

/** Normalizes an array of GsbSong objects from the GetSongBPM API
 * into the common Track shape */
export function normalizeGsbTracks(tracks: GsbSong[]): Track[] {
	return tracks.map(normalizeGsbTrack);
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

/** Normalizes an array of MbArtist objects from the MusicBrainz API
 * into the common Artist shape */
export function normalizeMbArtists(artists: MbArtist[]): Artist[] {
	return artists.map(normalizeMbArtist);
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

/** Normalizes an array of MbTrack objects from the MusicBrainz API
 * into the common Track shape */
export function normalizeMbTracks(tracks: MbTrack[]): Track[] {
	return tracks.map(normalizeMbTrack);
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

/** Normalizes an array of SpotifyArtist objects from the Spotify API
 * into the common Artist shape */
export function normalizeSpotifyArtists(artists: SpotifyArtist[]): Artist[] {
	return artists.map(normalizeSpotifyArtist);
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

/** Normalizes an array of SpotifyTrack objects from the Spotify API
 * into the common Track shape */
export function normalizeSpotifyTracks(tracks: SpotifyTrack[]): Track[] {
	return tracks.map(normalizeSpotifyTrack);
}
