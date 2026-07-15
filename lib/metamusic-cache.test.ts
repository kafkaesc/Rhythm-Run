import {
	clearNoTempoArtist,
	getCachedTracks,
	getNoTempoArtistDate,
	setCachedTracks,
	setNoTempoArtist,
} from './metamusic-cache';
import { clearCacheItem, getCacheItem, setCacheItem } from './cache';
import {
	CACHE_MAX_KEYS,
	CACHE_TTL_SECONDS,
	NO_TEMPO_CACHE_MAX_KEYS,
	NO_TEMPO_CACHE_TTL_SECONDS,
} from '@/lib/constants';
import { Track } from '@/models/rhythmRun';

// Mock the generic cache lib so no Redis client is created
// and no real cache calls are made
jest.mock('./cache', () => ({
	clearCacheItem: jest.fn(),
	getCacheItem: jest.fn(),
	setCacheItem: jest.fn(),
}));

// Reset after each test
afterEach(() => {
	jest.mocked(clearCacheItem).mockReset();
	jest.mocked(getCacheItem).mockReset();
	jest.mocked(setCacheItem).mockReset();
});

// Track object constructor for tests
function makeTrack(title: string, mbid: string, artistName: string): Track {
	return { artists: [artistName], bpm: 128, id: mbid, mbid, title };
}

it('Has getCachedTracks return tracks on a track cache hit', async () => {
	const tracks = [makeTrack('Basket Case', 'mbid-01', 'Green Day')];
	jest.mocked(getCacheItem).mockResolvedValue(tracks);
	const result = await getCachedTracks('mbid-01');
	expect(result).toEqual(tracks);
});

it('Has getCachedTracks return null on a track cache miss', async () => {
	jest.mocked(getCacheItem).mockResolvedValue(null);
	const result = await getCachedTracks('mbid-01');
	expect(result).toBeNull();
});

it('Has getCachedTracks read the artist key from the track cache', async () => {
	jest.mocked(getCacheItem).mockResolvedValue(null);
	await getCachedTracks('mbid-01');
	const [config, id] = jest.mocked(getCacheItem).mock.calls[0];
	expect(id).toBe('mbid-01');
	expect(config.keyFor('mbid-01')).toBe('artist:mbid-01:tracks');
	expect(config.lruSetKey).toBe('lru:artists');
	expect(config.maxKeys).toBe(CACHE_MAX_KEYS);
	expect(config.ttlSeconds).toBe(CACHE_TTL_SECONDS);
});

it('Has setCachedTracks store the tracks in the track cache', async () => {
	const tracks = [makeTrack('Basket Case', 'mbid-01', 'Green Day')];
	await setCachedTracks('mbid-01', tracks);
	const [config, id, value] = jest.mocked(setCacheItem).mock.calls[0];
	expect(id).toBe('mbid-01');
	expect(value).toEqual(tracks);
	expect(config.keyFor('mbid-01')).toBe('artist:mbid-01:tracks');
	expect(config.lruSetKey).toBe('lru:artists');
});

it('Has clearNoTempoArtist remove the artist from the no-tempo cache', async () => {
	await clearNoTempoArtist('mbid-01');
	const [config, id] = jest.mocked(clearCacheItem).mock.calls[0];
	expect(id).toBe('mbid-01');
	expect(config.keyFor('mbid-01')).toBe('no-tempo:artist:mbid-01');
	expect(config.lruSetKey).toBe('lru:no-tempo-artists');
	expect(config.maxKeys).toBe(NO_TEMPO_CACHE_MAX_KEYS);
	expect(config.ttlSeconds).toBe(NO_TEMPO_CACHE_TTL_SECONDS);
});

it('Has getNoTempoArtistDate return the datetime on a no-tempo cache hit', async () => {
	jest.mocked(getCacheItem).mockResolvedValue('2026-07-01T12:00:00.000Z');
	const result = await getNoTempoArtistDate('mbid-01');
	expect(result).toEqual(new Date('2026-07-01T12:00:00.000Z'));
});

it('Has getNoTempoArtistDate return null on a no-tempo cache miss', async () => {
	jest.mocked(getCacheItem).mockResolvedValue(null);
	const result = await getNoTempoArtistDate('mbid-01');
	expect(result).toBeNull();
});

it('Has setNoTempoArtist store an ISO datetime in the no-tempo cache', async () => {
	await setNoTempoArtist('mbid-01');
	const [config, id, value] = jest.mocked(setCacheItem).mock.calls[0];
	expect(id).toBe('mbid-01');
	expect(config.keyFor('mbid-01')).toBe('no-tempo:artist:mbid-01');
	expect(new Date(value as string).toISOString()).toBe(value);
});
