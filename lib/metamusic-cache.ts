// NEVER use client here: this is a server-only module

import {
	CacheConfig,
	clearCacheItem,
	getCacheItem,
	setCacheItem,
} from '@/lib/cache';
import {
	CACHE_MAX_KEYS,
	CACHE_TTL_SECONDS,
	NO_TEMPO_CACHE_MAX_KEYS,
	NO_TEMPO_CACHE_TTL_SECONDS,
} from '@/lib/constants';
import { Track } from '@/models/rhythmRun';

// Cache for an artist's enriched tracks with tempo data

/** Enriched tracks with a known BPM, keyed by artist MBID */
const trackCache: CacheConfig = {
	keyFor: (mbid) => `artist:${mbid}:tracks`,
	lruSetKey: 'lru:artists',
	maxKeys: CACHE_MAX_KEYS,
	ttlSeconds: CACHE_TTL_SECONDS,
};

/**
 * Returns cached enriched tracks for an artist, or null on a cache miss.
 *
 * @param mbid - MusicBrainz ID of the artist
 */
export function getCachedTracks(mbid: string): Promise<Track[] | null> {
	return getCacheItem<Track[]>(trackCache, mbid);
}

/**
 * Stores enriched tracks for an artist.
 *
 * @param mbid - MusicBrainz ID of the artist
 * @param tracks - Enriched tracks to cache (only those with a known BPM)
 */
export function setCachedTracks(mbid: string, tracks: Track[]): Promise<void> {
	return setCacheItem(trackCache, mbid, tracks);
}

// Cache for artists with no tempo data

/**
 * Artists whose tempo lookups produced no usable data, keyed by artist
 * MBID. Kept outside the track cache and its LRU set so no-tempo artists
 * never crowd out artists with tempo data.
 */
const noTempoCache: CacheConfig = {
	keyFor: (mbid) => `no-tempo:artist:${mbid}`,
	lruSetKey: 'lru:no-tempo-artists',
	maxKeys: NO_TEMPO_CACHE_MAX_KEYS,
	ttlSeconds: NO_TEMPO_CACHE_TTL_SECONDS,
};

/**
 * Removes an artist from the no-tempo cache, for when an artist
 * that previously had no tempo data starts producing usable results.
 *
 * @param mbid - MusicBrainz ID of the artist
 */
export function clearNoTempoArtist(mbid: string): Promise<void> {
	return clearCacheItem(noTempoCache, mbid);
}

/**
 * Returns the datetime of an artist's most recent no-tempo result,
 * or null if the artist is not in the no-tempo cache.
 *
 * @param mbid - MusicBrainz ID of the artist
 */
export async function getNoTempoArtistDate(mbid: string): Promise<Date | null> {
	const isoDate = await getCacheItem<string>(noTempoCache, mbid);
	if (isoDate === null) return null;

	return new Date(isoDate);
}

/**
 * Records a no-tempo result for an artist, storing the datetime
 * of the most recent lookup that produced no usable tempo data.
 *
 * @param mbid - MusicBrainz ID of the artist
 */
export function setNoTempoArtist(mbid: string): Promise<void> {
	return setCacheItem(noTempoCache, mbid, new Date().toISOString());
}
