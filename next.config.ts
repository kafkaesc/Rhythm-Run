import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	// Spotify does now allow a localhost URL callback, need to use IPv4 home
	allowedDevOrigins: ['127.0.0.1'],
	images: {
		remotePatterns: [
			{ hostname: '**.scdn.co', protocol: 'https' },
			{ hostname: '**.spotifycdn.com', protocol: 'https' },
		],
	},
	env: {
		GET_SONG_BPM_KEY: process.env.GET_SONG_BPM_KEY,
		LAST_FM_KEY: process.env.LAST_FM_KEY,
		SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
		SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
	},
};

export default nextConfig;
