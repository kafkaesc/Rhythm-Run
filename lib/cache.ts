// NEVER use client here: this is a server-only module

import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const cacheEnabled = process.env.CACHE_ENABLED !== 'false';

/**
 * Policy definition for one cache:
 * - the function to create an address within the Redis keyspace
 * - the key name for the Redis LRU sorted set that tracks item recency
 * - the maximum size
 * - the TTL
 *
 * Every cache operation takes a CacheConfig, so a new cache cannot be created
 * without declaring a config. Callers define one config per cache
 * (see lib/metamusic-cache.ts) and pass it to getCacheItem, setCacheItem,
 * and clearCacheItem.
 */
export interface CacheConfig {
	/** Builds the Redis key for an item id */
	keyFor: (id: string) => string;
	/** Redis key of the LRU sorted set backing the eviction policy */
	lruSetKey: string;
	/** Maximum number of items allowed before LRU eviction runs */
	maxKeys: number;
	/** Per-item TTL in seconds */
	ttlSeconds: number;
}

/**
 * Removes an item from the cache.
 *
 * @param config - Cache info and policy for the item being removed
 * @param id - Identifier of the item
 */
export async function clearCacheItem(
	config: CacheConfig,
	id: string,
): Promise<void> {
	// Return early is cache is not enabled
	if (!cacheEnabled) return;

	try {
		// Remove the item from both the LRU sorted set and its cache key
		await redis.zrem(config.lruSetKey, id);
		await redis.del(config.keyFor(id));
	} catch (err) {
		// If there's an error from Redis, log a warning
		console.warn('clearCacheItem failed for', config.keyFor(id), err);
	}
}

/**
 * Returns the cached value for an item, or null on a cache miss.
 *
 * @param config - Cache info and policy for the item
 * @param id - Identifier of the item
 */
export async function getCacheItem<T>(
	config: CacheConfig,
	id: string,
): Promise<T | null> {
	// Return early is cache is not enabled
	if (!cacheEnabled) return null;

	try {
		// Check for the item in Redis, null => cache miss, update LRU
		const value = await redis.get<T>(config.keyFor(id));
		if (value !== null) await touchLruEntry(config, id);

		return value;
	} catch (err) {
		// If there's an error from Redis, log a warning
		// and continue on as if it's a cache miss
		console.warn('getCacheItem failed for', config.keyFor(id), err);
		return null;
	}
}

/**
 * Evicts the least recently used item if the cache exceeds its
 * maxKeys. Removes the entry from both the LRU sorted set and
 * the item key in Redis.
 *
 * @param config - Cache info for the enforce the eviction policy
 */
async function runEvictionPolicy(config: CacheConfig): Promise<void> {
	// No eviction if within cache size
	const count = await redis.zcard(config.lruSetKey);
	if (count <= config.maxKeys) return;

	// Guard clause in case the LRU sorted set is empty despite the count above
	const lruCandidates = await redis.zrange(config.lruSetKey, 0, 0);
	if (lruCandidates.length === 0) {
		console.warn(
			'runEvictionPolicy:',
			config.lruSetKey,
			'is empty despite count',
			count,
		);
		return;
	}

	// Evict the LRU item from the lru_set and the item's cache key
	const id = lruCandidates[0] as string;
	await redis.zrem(config.lruSetKey, id);
	await redis.del(config.keyFor(id));
	console.info('runEvictionPolicy: evicted', id, 'from', config.lruSetKey);
}

/**
 * Stores a value for an item. Expiration is handled by
 * the cache's TTL and its maxKeys eviction cap.
 *
 * @param config - Cache info and policy for the item
 * @param id - Identifier of the item
 * @param value - Value to cache
 */
export async function setCacheItem<T>(
	config: CacheConfig,
	id: string,
	value: T,
): Promise<void> {
	// Return early is cache is not enabled
	if (!cacheEnabled) return;

	try {
		// Store the value in Redis with a TTL,
		// update LRU, and run the eviction policy
		await redis.set(config.keyFor(id), value, { ex: config.ttlSeconds });
		await touchLruEntry(config, id);
		await runEvictionPolicy(config);
	} catch (err) {
		// If there's an error from Redis, log a warning
		console.warn('setCacheItem failed for', config.keyFor(id), err);
	}
}

/**
 * Records or refreshes an item's last-access timestamp
 * in the cache's LRU sorted set.
 *
 * @param config - Cache info and policy for the item
 * @param id - Identifier of the item
 */
async function touchLruEntry(config: CacheConfig, id: string): Promise<void> {
	await redis.zadd(config.lruSetKey, { score: Date.now(), member: id });
}
