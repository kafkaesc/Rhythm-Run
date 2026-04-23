export interface Track {
	artists: string[];
	bpm?: number; // the whole reason we're here
	getSongBpmId?: string;
	id: string;
	spotifyId?: string;
	title: string;
}
