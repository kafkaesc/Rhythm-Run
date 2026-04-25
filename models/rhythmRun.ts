export interface Artist {
	genres: string[];
	getSongBpmId?: string;
	id: string;
	mbid?: string;
	name: string;
	spotifyId?: string;
}

export interface Track {
	artists: string[];
	bpm?: number; // the whole reason we're here
	getSongBpmId?: string;
	id: string;
	spotifyId?: string;
	title: string;
}
