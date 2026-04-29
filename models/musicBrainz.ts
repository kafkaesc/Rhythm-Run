// https://musicbrainz.org/doc/MusicBrainz_API
export interface MbArtist {
	id: string;
	name: string;
	'sort-name': string;
	type?: string;
	country?: string;
	score: number;
}

export type MbArtistResult = {
	artists: MbArtist[] | null;
	loading: boolean;
	error: string | null;
};
