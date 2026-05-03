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

// Base interface for shared track fields
interface LfmTrack {
	name: string;
	mbid: string;
	listeners: string;
	url: string;
}

// https://www.last.fm/api/show/track.search
export interface LfmSearchTrack extends LfmTrack {
	artist: string;
}

export type LfmTrackSearchResult = {
	tracks: LfmSearchTrack[] | null;
	loading: boolean;
	error: string | null;
};

// https://www.last.fm/api/show/artist.getTopTracks
export interface LfmTopTrack extends LfmTrack {
	playcount: string;
	artist: {
		name: string;
		mbid: string;
		url: string;
	};
}

export type LfmTopTrackResult = {
	tracks: LfmTopTrack[] | null;
	loading: boolean;
	error: string | null;
};
