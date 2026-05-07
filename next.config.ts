import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	env: {
		GET_SONG_BPM_KEY: process.env.GET_SONG_BPM_KEY,
		LAST_FM_KEY: process.env.LAST_FM_KEY,
		SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
		SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
	},
};

export default nextConfig;
