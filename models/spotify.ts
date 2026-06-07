// https://developer.spotify.com/documentation/web-api/reference/get-an-artist
export interface SpotifyArtist {
	external_urls: { spotify: string };
	genres?: string[];
	id: string;
	images: { url: string; width: number; height: number }[];
	name: string;
}

export type SpotifyArtistResult = {
	artists: SpotifyArtist[] | null;
	loading: boolean;
	error: string | null;
};

// https://developer.spotify.com/documentation/web-api/reference/add-tracks-to-playlist
export type SpotifyPlaylistAddTracksResult = {
	addTracks: (playlistId: string, trackUris: string[]) => Promise<boolean>;
	loading: boolean;
	error: string | null;
};

// https://developer.spotify.com/documentation/web-api/reference/get-track
export interface SpotifyTrack {
	album: {
		id: string;
		images: { height: number; url: string; width: number }[];
		name: string;
	};
	artists: { id: string; name: string }[];
	duration_ms: number;
	external_urls: { spotify: string };
	id: string;
	name: string;
}

export type SpotifyTrackResult = {
	tracks: SpotifyTrack[] | null;
	loading: boolean;
	error: string | null;
};

// https://developer.spotify.com/documentation/web-api/reference/get-a-list-of-current-users-playlists
export interface SpotifyPlaylist {
	external_urls: { spotify: string };
	id: string;
	images: { url: string; height: number | null; width: number | null }[];
	name: string;
	owner: { display_name: string | null; id: string };
	tracks: { total: number };
}

export type SpotifyPlaylistResult = {
	playlists: SpotifyPlaylist[] | null;
	loading: boolean;
	error: string | null;
};
