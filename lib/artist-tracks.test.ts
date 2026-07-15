import {
	cacheEnrichmentResult,
	fetchTopTracksByArtist,
	groupByCacheStatus,
} from './artist-tracks';
import { fetchArtistTopTracks } from './lastfm';
import {
	clearNoTempoArtist,
	getCachedTracks,
	getNoTempoArtistDate,
	setCachedTracks,
	setNoTempoArtist,
} from './metamusic-cache';
import { LfmTopTrack } from '@/models/lastFm';
import { Track } from '@/models/rhythmRun';

// Mock the Last.fm lib so no real API calls are made
jest.mock('./lastfm', () => ({
	fetchArtistTopTracks: jest.fn(),
}));

// Mock the MetaMusic cache lib so no Redis client is created
// and no real cache calls are made
jest.mock('./metamusic-cache', () => ({
	clearNoTempoArtist: jest.fn(),
	getCachedTracks: jest.fn(),
	getNoTempoArtistDate: jest.fn(),
	setCachedTracks: jest.fn(),
	setNoTempoArtist: jest.fn(),
}));

// Reset mocks and timers after each test
afterEach(() => {
	jest.resetAllMocks();
	jest.useRealTimers();
});

// Track object constructor for tests
function makeTrack(title: string, mbid: string, bpm?: number): Track {
	return { artists: ['Green Day'], bpm, id: mbid, mbid, title };
}

// Last.fm top track object constructor for tests
function makeLfmTrack(name: string, mbid: string): LfmTopTrack {
	return {
		name,
		mbid,
		artist: { name: 'Green Day', mbid: '', url: '' },
		listeners: '0',
		url: '',
		playcount: '0',
	};
}

it('Has cacheEnrichmentResult store tracks with a BPM and clear the no-tempo entry', async () => {
	const withBpm = makeTrack('Basket Case', 'mbid-01', 128);
	const withoutBpm = makeTrack('Longview', 'mbid-02');
	await cacheEnrichmentResult('artist-01', [withBpm, withoutBpm]);
	expect(setCachedTracks).toHaveBeenCalledWith('artist-01', [withBpm]);
	expect(clearNoTempoArtist).toHaveBeenCalledWith('artist-01');
	expect(setNoTempoArtist).not.toHaveBeenCalled();
});

it('Has cacheEnrichmentResult record a no-tempo artist when no tracks have a BPM', async () => {
	const withoutBpm = makeTrack('Longview', 'mbid-02');
	await cacheEnrichmentResult('artist-01', [withoutBpm]);
	expect(setNoTempoArtist).toHaveBeenCalledWith('artist-01');
	expect(setCachedTracks).not.toHaveBeenCalled();
	expect(clearNoTempoArtist).not.toHaveBeenCalled();
});

it('Has fetchTopTracksByArtist return top tracks keyed by artist MBID in order', async () => {
	jest.useFakeTimers();
	const tracksOne = [makeLfmTrack('Basket Case', 'mbid-01')];
	const tracksTwo = [makeLfmTrack('Feel Good Inc.', 'mbid-02')];
	jest
		.mocked(fetchArtistTopTracks)
		.mockResolvedValueOnce(tracksOne)
		.mockResolvedValueOnce(tracksTwo);
	const promise = fetchTopTracksByArtist(['artist-01', 'artist-02'], 'test-key');
	await jest.advanceTimersByTimeAsync(1000);
	const result = await promise;
	expect(result).toEqual([
		{ mbid: 'artist-01', tracks: tracksOne },
		{ mbid: 'artist-02', tracks: tracksTwo },
	]);
	expect(fetchArtistTopTracks).toHaveBeenCalledWith('artist-01', 'test-key');
	expect(fetchArtistTopTracks).toHaveBeenCalledWith('artist-02', 'test-key');
});

it('Has fetchTopTracksByArtist record a failed fetch in the no-tempo cache and omit the artist', async () => {
	const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
	jest.useFakeTimers();
	const tracksTwo = [makeLfmTrack('Feel Good Inc.', 'mbid-02')];
	jest
		.mocked(fetchArtistTopTracks)
		.mockRejectedValueOnce(new Error('Last.fm down'))
		.mockResolvedValueOnce(tracksTwo);
	const promise = fetchTopTracksByArtist(['artist-01', 'artist-02'], 'test-key');
	await jest.advanceTimersByTimeAsync(1000);
	const result = await promise;
	expect(result).toEqual([{ mbid: 'artist-02', tracks: tracksTwo }]);
	expect(setNoTempoArtist).toHaveBeenCalledWith('artist-01');
	expect(errorSpy).toHaveBeenCalledWith(
		'Last.fm top tracks fetch failed for',
		'artist-01',
		expect.any(Error),
	);
	errorSpy.mockRestore();
});

it('Has groupByCacheStatus sort artists into cached, unknown, and deferred groups', async () => {
	const cached = [makeTrack('Basket Case', 'mbid-01', 128)];
	jest
		.mocked(getCachedTracks)
		.mockImplementation(async (mbid) => (mbid === 'artist-01' ? cached : null));
	jest
		.mocked(getNoTempoArtistDate)
		.mockImplementation(async (mbid) =>
			mbid === 'artist-03' ? new Date('2026-07-01T12:00:00.000Z') : null,
		);
	const result = await groupByCacheStatus(['artist-01', 'artist-02', 'artist-03']);
	expect(result).toEqual({
		cachedTracks: [cached],
		deferredMbids: ['artist-03'],
		unknownMbids: ['artist-02'],
	});
});
