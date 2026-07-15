import { Redis } from '@upstash/redis';
import {
	CacheConfig,
	clearCacheItem,
	getCacheItem,
	setCacheItem,
} from './cache';

// Mock the Upstash Redis client so no real Redis calls are made
jest.mock('@upstash/redis', () => {
	const client = {
		del: jest.fn(),
		get: jest.fn(),
		set: jest.fn(),
		zadd: jest.fn(),
		zcard: jest.fn(),
		zrange: jest.fn(),
		zrem: jest.fn(),
	};
	return { Redis: { fromEnv: () => client } };
});

/** The mocked Redis client's functions, typed as plain jest mocks */
interface MockRedisClient {
	del: jest.Mock;
	get: jest.Mock;
	set: jest.Mock;
	zadd: jest.Mock;
	zcard: jest.Mock;
	zrange: jest.Mock;
	zrem: jest.Mock;
}

// fromEnv returns the same client object the cache lib holds
const redis = Redis.fromEnv() as unknown as MockRedisClient;

const ORIGINAL_CACHE_ENABLED = process.env.CACHE_ENABLED;

/** Cache policy under test, small maxKeys to make eviction easy to trigger */
const testConfig: CacheConfig = {
	keyFor: (id) => `test:${id}`,
	lruSetKey: 'lru:test',
	maxKeys: 2,
	ttlSeconds: 60,
};

// Reset mocks and the CACHE_ENABLED env var after each test
afterEach(() => {
	jest.resetAllMocks();
	if (ORIGINAL_CACHE_ENABLED !== undefined)
		process.env.CACHE_ENABLED = ORIGINAL_CACHE_ENABLED;
	else delete process.env.CACHE_ENABLED;
});

/**
 * Reloads the cache lib with CACHE_ENABLED=false so the module-level
 * flag is captured as disabled, returning the fresh lib and the fresh
 * mocked Redis client created alongside it.
 */
async function loadDisabledCacheLib() {
	process.env.CACHE_ENABLED = 'false';
	jest.resetModules();
	const cacheLib = await import('./cache');
	const upstash = await import('@upstash/redis');
	const client = upstash.Redis.fromEnv() as unknown as MockRedisClient;
	return { cacheLib, client };
}

it('Has getCacheItem return the value and touch the LRU set on a hit', async () => {
	redis.get.mockResolvedValue('cached-value');
	const result = await getCacheItem<string>(testConfig, 'id-01');
	expect(result).toBe('cached-value');
	expect(redis.get).toHaveBeenCalledWith('test:id-01');
	expect(redis.zadd).toHaveBeenCalledWith('lru:test', {
		member: 'id-01',
		score: expect.any(Number),
	});
});

it('Has getCacheItem return null and skip the LRU touch on a miss', async () => {
	redis.get.mockResolvedValue(null);
	const result = await getCacheItem<string>(testConfig, 'id-01');
	expect(result).toBeNull();
	expect(redis.zadd).not.toHaveBeenCalled();
});

it('Has getCacheItem return null and warn when Redis throws', async () => {
	const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
	redis.get.mockRejectedValue(new Error('Redis down'));
	const result = await getCacheItem<string>(testConfig, 'id-01');
	expect(result).toBeNull();
	expect(warnSpy).toHaveBeenCalledWith(
		'getCacheItem failed for',
		'test:id-01',
		expect.any(Error),
	);
	warnSpy.mockRestore();
});

it('Has setCacheItem store the value with the TTL and touch the LRU set', async () => {
	redis.zcard.mockResolvedValue(1);
	await setCacheItem(testConfig, 'id-01', 'new-value');
	expect(redis.set).toHaveBeenCalledWith('test:id-01', 'new-value', {
		ex: 60,
	});
	expect(redis.zadd).toHaveBeenCalledWith('lru:test', {
		member: 'id-01',
		score: expect.any(Number),
	});
});

it('Has setCacheItem skip eviction when the cache is within maxKeys', async () => {
	redis.zcard.mockResolvedValue(2);
	await setCacheItem(testConfig, 'id-01', 'new-value');
	expect(redis.zrange).not.toHaveBeenCalled();
	expect(redis.zrem).not.toHaveBeenCalled();
});

it('Has setCacheItem evict the least recently used item when over maxKeys', async () => {
	const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
	redis.zcard.mockResolvedValue(3);
	redis.zrange.mockResolvedValue(['id-01']);
	await setCacheItem(testConfig, 'id-03', 'new-value');
	expect(redis.zrange).toHaveBeenCalledWith('lru:test', 0, 0);
	expect(redis.zrem).toHaveBeenCalledWith('lru:test', 'id-01');
	expect(redis.del).toHaveBeenCalledWith('test:id-01');
	infoSpy.mockRestore();
});

it('Has setCacheItem warn and skip eviction when the LRU set is empty despite the count', async () => {
	const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
	redis.zcard.mockResolvedValue(3);
	redis.zrange.mockResolvedValue([]);
	await setCacheItem(testConfig, 'id-01', 'new-value');
	expect(warnSpy).toHaveBeenCalledWith(
		'runEvictionPolicy:',
		'lru:test',
		'is empty despite count',
		3,
	);
	expect(redis.zrem).not.toHaveBeenCalled();
	expect(redis.del).not.toHaveBeenCalled();
	warnSpy.mockRestore();
});

it('Has setCacheItem warn when Redis throws', async () => {
	const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
	redis.set.mockRejectedValue(new Error('Redis down'));
	await setCacheItem(testConfig, 'id-01', 'new-value');
	expect(warnSpy).toHaveBeenCalledWith(
		'setCacheItem failed for',
		'test:id-01',
		expect.any(Error),
	);
	expect(redis.zadd).not.toHaveBeenCalled();
	warnSpy.mockRestore();
});

it('Has clearCacheItem remove the item from the LRU set and the cache', async () => {
	await clearCacheItem(testConfig, 'id-01');
	expect(redis.zrem).toHaveBeenCalledWith('lru:test', 'id-01');
	expect(redis.del).toHaveBeenCalledWith('test:id-01');
});

it('Has clearCacheItem warn when Redis throws', async () => {
	const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
	redis.zrem.mockRejectedValue(new Error('Redis down'));
	await clearCacheItem(testConfig, 'id-01');
	expect(warnSpy).toHaveBeenCalledWith(
		'clearCacheItem failed for',
		'test:id-01',
		expect.any(Error),
	);
	expect(redis.del).not.toHaveBeenCalled();
	warnSpy.mockRestore();
});

it('Has getCacheItem return null without calling Redis when the cache is disabled', async () => {
	const { cacheLib, client } = await loadDisabledCacheLib();
	const result = await cacheLib.getCacheItem<string>(testConfig, 'id-01');
	expect(result).toBeNull();
	expect(client.get).not.toHaveBeenCalled();
});

it('Has setCacheItem do nothing when the cache is disabled', async () => {
	const { cacheLib, client } = await loadDisabledCacheLib();
	await cacheLib.setCacheItem(testConfig, 'id-01', 'new-value');
	expect(client.set).not.toHaveBeenCalled();
	expect(client.zadd).not.toHaveBeenCalled();
});

it('Has clearCacheItem do nothing when the cache is disabled', async () => {
	const { cacheLib, client } = await loadDisabledCacheLib();
	await cacheLib.clearCacheItem(testConfig, 'id-01');
	expect(client.zrem).not.toHaveBeenCalled();
	expect(client.del).not.toHaveBeenCalled();
});
