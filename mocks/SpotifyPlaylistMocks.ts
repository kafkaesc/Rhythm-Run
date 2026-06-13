// cspell:disable

import { SpotifyPlaylist } from '@/models/spotify';

export const SpotifyJVibesPlaylist: SpotifyPlaylist = {
	collaborative: false,
	external_urls: {
		spotify: 'https://open.spotify.com/playlist/6Fyac1DGI2Q6OnmfIu06yL',
	},
	id: 'PL9001',
	images: [
		{
			url: 'https://mosaic.scdn.co/640/ab67616d00001e02107d9fbd3906ad9cf16b8543ab67616d00001e023845bf34d6de22fedf6e955aab67616d00001e025f2cfd3f9e99c27f4',
			height: 640,
			width: 640,
		},
		{
			url: 'https://mosaic.scdn.co/300/ab67616d00001e02107d9fbd3906ad9cf16b8543ab67616d00001e023845bf34d6de22fedf6e955aab67616d00001e025f2cfd3f9e99c27f4',
			height: 300,
			width: 300,
		},
		{
			url: 'https://mosaic.scdn.co/60/ab67616d00001e02107d9fbd3906ad9cf16b8543ab67616d00001e023845bf34d6de22fedf6e955aab67616d00001e025f2cfd3f9e99c27f4',
			height: 60,
			width: 60,
		},
	],
	name: 'J-Vibes',
	owner: { display_name: 'Jared Hettinger', id: 'kafkaesc' },
	tracks: { total: 4 },
};

export const SpotifyNoCoverArtPlaylist: SpotifyPlaylist = {
	collaborative: false,
	id: '37i9dQZF1DWX9yJXCdgpke',
	name: 'No Cover Art',
	images: [],
	external_urls: {
		spotify: 'https://open.spotify.com/playlist/37i9dQZF1DWX9yJXCdgpke',
	},
	owner: { display_name: 'Jared Hettinger', id: 'kafkaesc' },
	tracks: { total: 5 },
};
