// https://www.last.fm/api/show/artist.search
export interface LfmArtist {
	name: string;
	mbid: string;
	url: string;
}

export type LfmArtistResult = {
	artists: LfmArtist[] | null;
	loading: boolean;
	error: string | null;
};

// https://www.last.fm/api/show/artist.getTopTracks
export interface LfmTrack {
	name: string;
	mbid: string;
	playcount: string;
	listeners: string;
	url: string;
	artist: {
		name: string;
		mbid: string;
		url: string;
	};
}

export type LfmTrackResult = {
	tracks: LfmTrack[] | null;
	loading: boolean;
	error: string | null;
};
