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
};

export default nextConfig;
