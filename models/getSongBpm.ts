export interface GsbAlbum {
	title: string;
	uri: string;
	year: string;
}

export interface GsbArtist {
	from: string;
	genres: string[] | null;
	id: string;
	mbid: string;
	name: string;
	similar?: GsbArtist[] | null;
	uri: string;
}

export interface GsbSong {
	acousticness: number;
	album: GsbAlbum;
	artist: GsbArtist;
	danceability: number;
	id: string;
	key_of: string;
	open_key: string;
	tempo: string;
	time_sig: string;
	title: string;
	uri: string;
}

export interface GsbTempo {
	album: GsbAlbum[];
	artist: GsbArtist[];
	song_id: string;
	song_title: string;
	song_uri: string;
	tempo: number;
}

export type GsbArtistResult = {
	artists: GsbArtist[] | null;
	loading: boolean;
	error: string | null;
};

export type GsbSongResult = {
	songs: GsbSong[] | null;
	loading: boolean;
	error: string | null;
};

export type GsbTempoResult = {
	songs: GsbTempo[] | null;
	loading: boolean;
	error: string | null;
};
