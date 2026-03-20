export interface SpotifyTrack {
	id: string;
	name: string;
	duration_ms: number;
	artists: { id: string; name: string }[];
	album: {
		id: string;
		name: string;
		images: { url: string; width: number; height: number }[];
	};
	external_urls: { spotify: string };
}
