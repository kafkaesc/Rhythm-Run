import { enrichWithTempoStream } from './metamusic';
import { fetchGsbTempo } from './getsongbpm';
import { LfmTopTrack } from '@/models/lastFm';
import { Track } from '@/models/rhythmRun';

// Mock the GetSongBPM lib so no real API calls are made
// and the rate limiting delay is set to zero
jest.mock('./getsongbpm', () => ({
	fetchGsbTempo: jest.fn(),
	GSB_RATE_LIMIT_MS: 0,
}));

// Reset after each test
afterEach(() => {
	jest.mocked(fetchGsbTempo).mockReset();
});

// Drains an async generator into an array so we can test the full result
async function collectStream(gen: AsyncGenerator<Track>): Promise<Track[]> {
	const results: Track[] = [];
	for await (const item of gen) {
		results.push(item);
	}
	return results;
}

// Track object constructor for tests
function makeTrack(
	name: string,
	mbid: string,
	artistName: string,
): LfmTopTrack {
	return {
		name,
		mbid,
		artist: { name: artistName, mbid: '', url: '' },
		listeners: '0',
		url: '',
		playcount: '0',
	};
}

it('Has enrichWithTempoStream yield nothing when no tracks have an MBID', async () => {
	const tracks = [makeTrack('Basket Case', '', 'Green Day')];
	const results = await collectStream(
		enrichWithTempoStream(tracks, 'test-key'),
	);
	expect(results).toEqual([]);
});

it('Has enrichWithTempoStream skip tracks with duplicate MBIDs', async () => {
	jest.mocked(fetchGsbTempo).mockResolvedValue(128);
	const tracks = [
		makeTrack('Basket Case', 'mbid-01', 'Green Day'),
		makeTrack('Basket Case', 'mbid-01', 'Green Day'),
	];
	const results = await collectStream(
		enrichWithTempoStream(tracks, 'test-key'),
	);
	expect(results).toHaveLength(1);
});

it('Has enrichWithTempoStream yield a track with BPM when fetchGsbTempo returns a number', async () => {
	jest.mocked(fetchGsbTempo).mockResolvedValue(128);
	const tracks = [makeTrack('Basket Case', 'mbid-01', 'Green Day')];
	const results = await collectStream(
		enrichWithTempoStream(tracks, 'test-key'),
	);
	expect(results).toEqual([
		{
			id: 'mbid-01',
			title: 'Basket Case',
			artists: ['Green Day'],
			mbid: 'mbid-01',
			bpm: 128,
		},
	]);
});

it('Has enrichWithTempoStream yield a track without BPM when fetchGsbTempo returns null', async () => {
	jest.mocked(fetchGsbTempo).mockResolvedValue(null);
	const tracks = [makeTrack('Basket Case', 'mbid-01', 'Green Day')];
	const results = await collectStream(
		enrichWithTempoStream(tracks, 'test-key'),
	);
	expect(results).toEqual([
		{
			id: 'mbid-01',
			title: 'Basket Case',
			artists: ['Green Day'],
			mbid: 'mbid-01',
		},
	]);
});

it('Has enrichWithTempoStream yield multiple tracks in order', async () => {
	jest
		.mocked(fetchGsbTempo)
		.mockResolvedValueOnce(128)
		.mockResolvedValueOnce(136);
	const tracks = [
		makeTrack('Basket Case', 'mbid-01', 'Green Day'),
		makeTrack('Feel Good Inc.', 'mbid-02', 'Gorillaz'),
	];
	const results = await collectStream(
		enrichWithTempoStream(tracks, 'test-key'),
	);
	expect(results).toEqual([
		{
			id: 'mbid-01',
			title: 'Basket Case',
			artists: ['Green Day'],
			mbid: 'mbid-01',
			bpm: 128,
		},
		{
			id: 'mbid-02',
			title: 'Feel Good Inc.',
			artists: ['Gorillaz'],
			mbid: 'mbid-02',
			bpm: 136,
		},
	]);
});
