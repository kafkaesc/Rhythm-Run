// NEVER use client here: this is a server-only module

import { Redis } from '@upstash/redis';
import { CACHE_TTL_SECONDS } from '@/lib/constants';
import { Track } from '@/models/rhythmRun';

const redis = Redis.fromEnv();
const cacheEnabled = process.env.CACHE_ENABLED !== 'false';

function trackKey(mbid: string): string {
	return `artist:${mbid}:tracks`;
}

/**
 * Returns cached enriched tracks for an artist, or null on a cache miss.
 *
 * @param mbid - MusicBrainz ID of the artist
 */
export async function getCachedTracks(mbid: string): Promise<Track[] | null> {
	// Return early is cache is not enabled
	if (!cacheEnabled) return null;

	try {
		// Check for the artist's tracks in Redis, null => cache miss
		return await redis.get<Track[]>(trackKey(mbid));
	} catch (err) {
		// If there's an error from Redis, log a warning
		// and continue on as if it's a cache miss
		console.warn('getCachedTracks failed for', mbid, err);
		return null;
	}
}

/**
 * Stores enriched tracks for an artist. Expiration is handled by the TTL.
 *
 * @param mbid - MusicBrainz ID of the artist
 * @param tracks - Enriched tracks to cache (only those with a known BPM)
 */
export async function setCachedTracks(
	mbid: string,
	tracks: Track[],
): Promise<void> {
	// Return early is cache is not enabled
	if (!cacheEnabled) return;

	try {
		// Store the tracks in Redis with a TTL
		await redis.set(trackKey(mbid), tracks, { ex: CACHE_TTL_SECONDS });
	} catch (err) {
		// If there's an error from Redis, log a warning
		console.warn('setCachedTracks failed for', mbid, err);
	}
}
