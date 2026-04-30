import { GsbArtist, GsbSong } from '@/models/getSongBpm';
import { SpotifyArtist, SpotifyTrack } from '@/models/spotify';
import { Artist, Track } from '@/models/rhythmRun';
import { MbArtist, MbTrack } from '@/models/musicBrainz';

/** Normalizes a GsbArtist from the GetSongBPM API into the common Artist shape */
export function NormalizeGsbArtist(artist: GsbArtist): Artist {
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
export function NormalizeGsbArtists(artists: GsbArtist[]): Artist[] {
	return artists.map(NormalizeGsbArtist);
}

/** Normalizes a GsbSong from the GetSongBPM API into the common Track shape */
export function NormalizeGsbTrack(track: GsbSong): Track {
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
export function NormalizeGsbTracks(tracks: GsbSong[]): Track[] {
	return tracks.map(NormalizeGsbTrack);
}

/** Normalizes a MbArtist from the MusicBrainz API into the common Artist shape */
export function NormalizeMbArtist(artist: MbArtist): Artist {
	return {
		id: artist.id,
		mbid: artist.id,
		name: artist.name,
		genres: [],
	};
}

/** Normalizes an array of MbArtist objects from the MusicBrainz API
 * into the common Artist shape */
export function NormalizeMbArtists(artists: MbArtist[]): Artist[] {
	return artists.map(NormalizeMbArtist);
}

/** Normalizes a MbTrack from the MusicBrainz API into the common Track shape */
export function NormalizeMbTrack(track: MbTrack): Track {
	return {
		id: track.id,
		title: track.title,
		artists: [track['artist-credit'].map((c) => c.name + (c.joinphrase ?? '')).join('')],
	};
}

/** Normalizes an array of MbTrack objects from the MusicBrainz API
 * into the common Track shape */
export function NormalizeMbTracks(tracks: MbTrack[]): Track[] {
	return tracks.map(NormalizeMbTrack);
}

/** Normalizes a SpotifyArtist from the Spotify API into the common Artist shape */
export function NormalizeSpotifyArtist(artist: SpotifyArtist): Artist {
	return {
		id: artist.id,
		spotifyId: artist.id,
		name: artist.name,
		genres: artist.genres,
	};
}

/** Normalizes an array of SpotifyArtist objects from the Spotify API
 * into the common Artist shape */
export function NormalizeSpotifyArtists(artists: SpotifyArtist[]): Artist[] {
	return artists.map(NormalizeSpotifyArtist);
}

/** Normalizes a SpotifyTrack from the Spotify API into the common Track shape */
export function NormalizeSpotifyTrack(track: SpotifyTrack): Track {
	return {
		id: track.id,
		spotifyId: track.id,
		title: track.name,
		artists: track.artists.map((ar) => ar.name),
	};
}

/** Normalizes an array of SpotifyTrack objects from the Spotify API
 * into the common Track shape */
export function NormalizeSpotifyTracks(tracks: SpotifyTrack[]): Track[] {
	return tracks.map(NormalizeSpotifyTrack);
}
