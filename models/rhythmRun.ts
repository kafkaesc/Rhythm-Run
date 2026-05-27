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
	albumArt?: string;
	artists: string[];
	bpm?: number; // the whole reason we're here
	durationMs?: number;
	gsbDanceability?: number;
	getSongBpmId?: string;
	id: string;
	mbid?: string;
	spotifyId?: string;
	spotifyUrl?: string;
	title: string;
}
