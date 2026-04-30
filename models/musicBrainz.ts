// https://musicbrainz.org/doc/MusicBrainz_API
export interface MbArtist {
	id: string;
	name: string;
	'sort-name': string;
	type?: string;
	country?: string;
	score: number;
}

export interface MbArtistCredit {
	name: string;
	artist: {
		id: string;
		name: string;
		'sort-name': string;
	};
	joinphrase?: string;
}

export type MbArtistResult = {
	artists: MbArtist[] | null;
	loading: boolean;
	error: string | null;
};

export interface MbTrack {
	id: string;
	title: string;
	length?: number;
	score: number;
	'artist-credit': MbArtistCredit[];
}

export type MbTrackResult = {
	tracks: MbTrack[] | null;
	loading: boolean;
	error: string | null;
};
