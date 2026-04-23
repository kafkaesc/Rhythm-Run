import { GsbSong } from '@/models/getSongBpm';
import { SpotifyTrack } from '@/models/spotify';
import { Track } from '@/models/rhythmRun';

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
