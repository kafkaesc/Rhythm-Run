import { ReactNode } from 'react';

export interface Artist {
	genres: string[];
	getSongBpmId?: string;
	id: string;
	mbid?: string;
	name: string;
	spotifyId?: string;
}

export interface ReactNodeAndKey {
	key: string;
	node: ReactNode;
}

export interface Track {
	artists: string[];
	bpm?: number; // the whole reason we're here
	gsbDanceability?: number;
	getSongBpmId?: string;
	id: string;
	mbid?: string;
	spotifyId?: string;
	title: string;
}
