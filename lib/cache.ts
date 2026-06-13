// NEVER use client here: this is a server-only module

import { Redis } from '@upstash/redis';
import { CACHE_MAX_KEYS, CACHE_TTL_SECONDS } from '@/lib/constants';
import { Track } from '@/models/rhythmRun';

const redis = Redis.fromEnv();
const cacheEnabled = process.env.CACHE_ENABLED !== 'false';

const LRU_SET_KEY = 'lru:artists';

function trackKey(mbid: string): string {
	return `artist:${mbid}:tracks`;
}

/**
 * Records or refreshes an artist's last-access timestamp in the LRU sorted set.
 *
 * @param mbid - MusicBrainz ID of the artist
 */
async function touchLruEntry(mbid: string): Promise<void> {
	await redis.zadd(LRU_SET_KEY, { score: Date.now(), member: mbid });
}

/**
 * Evicts the least recently used artist entry if the cache
 * exceeds CACHE_MAX_KEYS. Removes the entry from both the
 * LRU sorted set and the track key in Redis.
 */
async function runEvictionPolicy(): Promise<void> {
	// No eviction if within cache size
	const count = await redis.zcard(LRU_SET_KEY);
	if (count <= CACHE_MAX_KEYS) return;

	// Guard clause in case the lru:artists set is empty despite X
	const lruCandidates = await redis.zrange(LRU_SET_KEY, 0, 0);
	if (lruCandidates.length === 0) {
		console.warn(
			'runEvictionPolicy: lru:artists is empty despite count',
			count,
		);
		return;
	}

	// Evict the LRU artist from the lru_set and the tempo tracks cache
	const mbid = lruCandidates[0] as string;
	await redis.zrem(LRU_SET_KEY, mbid);
	await redis.del(trackKey(mbid));
	console.info('runEvictionPolicy: evicted', mbid);
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
		// Check for the artist's tracks in Redis, null => cache miss, update LRU
		const tracks = await redis.get<Track[]>(trackKey(mbid));
		if (tracks !== null) await touchLruEntry(mbid);

		return tracks;
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
		// Store the tracks in Redis with a TTL,
		// update LRU, and run the eviction policy
		await redis.set(trackKey(mbid), tracks, { ex: CACHE_TTL_SECONDS });
		await touchLruEntry(mbid);
		await runEvictionPolicy();
	} catch (err) {
		// If there's an error from Redis, log a warning
		console.warn('setCachedTracks failed for', mbid, err);
	}
}
