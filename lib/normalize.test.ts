import {
	normalizeGsbArtist,
	normalizeGsbArtists,
	normalizeGsbTrack,
	normalizeGsbTracks,
	normalizeMbArtist,
	normalizeMbArtists,
	normalizeMbTrack,
	normalizeMbTracks,
	normalizeSpotifyArtist,
	normalizeSpotifyArtists,
	normalizeSpotifyTrack,
	normalizeSpotifyTracks,
} from './normalize';
import { GsbGreenDay, GsbDaftPunk, GsbBadBunny } from '@/mocks/GsbArtistMocks';
import { GsbBasketCase, GsbFeelGoodInc } from '@/mocks/GsbTrackMocks';
import { MbGreenDay, MbDaftPunk } from '@/mocks/MbArtistMocks';
import { MbBasketCase, MbFeelGoodInc } from '@/mocks/MbTrackMocks';
import { SpGreenDay, SpDaftPunk } from '@/mocks/SpotifyArtistMocks';
import { SpBasketCase, SpFeelGoodInc } from '@/mocks/SpotifyTrackMocks';

it('NormalizeGsbArtist normalizes Green Day correctly', () => {
	const result = normalizeGsbArtist(GsbGreenDay);
	expect(result).toEqual({
		id: 'v9M',
		getSongBpmId: 'v9M',
		mbid: '084308bd-1654-436f-ba03-df6697104e19',
		name: 'Green Day',
		genres: ['pop', 'punk', 'rock'],
	});
});

it('NormalizeGsbArtist normalizes an artist with null genres as an empty array', () => {
	const result = normalizeGsbArtist(GsbBadBunny);
	expect(result.genres).toEqual([]);
});

it('NormalizeGsbArtist normalizes Daft Punk correctly', () => {
	const result = normalizeGsbArtist(GsbDaftPunk);
	expect(result).toEqual({
		id: 'j0B',
		getSongBpmId: 'j0B',
		mbid: '056e4f3e-d505-4dad-8ec1-d04f521cbb56',
		name: 'Daft Punk',
		genres: ['electronic', 'funk', 'rock'],
	});
});

it('NormalizeGsbArtists normalizes an array of artists correctly', () => {
	const result = normalizeGsbArtists([GsbGreenDay, GsbDaftPunk]);
	expect(result).toEqual([
		{
			id: 'v9M',
			getSongBpmId: 'v9M',
			mbid: '084308bd-1654-436f-ba03-df6697104e19',
			name: 'Green Day',
			genres: ['pop', 'punk', 'rock'],
		},
		{
			id: 'j0B',
			getSongBpmId: 'j0B',
			mbid: '056e4f3e-d505-4dad-8ec1-d04f521cbb56',
			name: 'Daft Punk',
			genres: ['electronic', 'funk', 'rock'],
		},
	]);
});

it('NormalizeGsbTrack normalizes Basket Case correctly', () => {
	const result = normalizeGsbTrack(GsbBasketCase);
	expect(result).toEqual({
		id: 'N7rQD',
		getSongBpmId: 'N7rQD',
		title: 'Basket Case',
		artists: ['Green Day'],
		bpm: 170,
	});
});

it('NormalizeGsbTrack normalizes Feel Good Inc. correctly', () => {
	const result = normalizeGsbTrack(GsbFeelGoodInc);
	expect(result).toEqual({
		id: 'D95mAy',
		getSongBpmId: 'D95mAy',
		title: 'Feel Good Inc.',
		artists: ['Gorillaz'],
		bpm: 136,
	});
});

it('NormalizeGsbTracks normalizes an array of tracks correctly', () => {
	const result = normalizeGsbTracks([GsbBasketCase, GsbFeelGoodInc]);
	expect(result).toEqual([
		{
			id: 'N7rQD',
			getSongBpmId: 'N7rQD',
			title: 'Basket Case',
			artists: ['Green Day'],
			bpm: 170,
		},
		{
			id: 'D95mAy',
			getSongBpmId: 'D95mAy',
			title: 'Feel Good Inc.',
			artists: ['Gorillaz'],
			bpm: 136,
		},
	]);
});

it('NormalizeMbArtist normalizes Green Day correctly', () => {
	const result = normalizeMbArtist(MbGreenDay);
	expect(result).toEqual({
		id: '084308bd-1654-436f-ba03-df6697104e19',
		mbid: '084308bd-1654-436f-ba03-df6697104e19',
		name: 'Green Day',
		genres: [],
	});
});

it('NormalizeMbArtist normalizes Daft Punk correctly', () => {
	const result = normalizeMbArtist(MbDaftPunk);
	expect(result).toEqual({
		id: '056e4f3e-d505-4dad-8ec1-d04f521cbb56',
		mbid: '056e4f3e-d505-4dad-8ec1-d04f521cbb56',
		name: 'Daft Punk',
		genres: [],
	});
});

it('NormalizeMbTrack normalizes Basket Case correctly', () => {
	const result = normalizeMbTrack(MbBasketCase);
	expect(result).toEqual({
		id: '464f46cc-0530-4360-b019-3b05884d0344',
		title: 'Basket Case',
		artists: ['Green Day'],
	});
});

it('NormalizeMbTrack normalizes Feel Good Inc. with joinphrase correctly', () => {
	const result = normalizeMbTrack(MbFeelGoodInc);
	expect(result).toEqual({
		id: '7938f2fd-ea5b-4f3b-949d-2e3c6db82c74',
		title: 'Feel Good Inc.',
		artists: ['Gorillaz feat. De La Soul'],
	});
});

it('NormalizeMbTracks normalizes an array of tracks correctly', () => {
	const result = normalizeMbTracks([MbBasketCase, MbFeelGoodInc]);
	expect(result).toEqual([
		{
			id: '464f46cc-0530-4360-b019-3b05884d0344',
			title: 'Basket Case',
			artists: ['Green Day'],
		},
		{
			id: '7938f2fd-ea5b-4f3b-949d-2e3c6db82c74',
			title: 'Feel Good Inc.',
			artists: ['Gorillaz feat. De La Soul'],
		},
	]);
});

it('NormalizeMbArtists normalizes an array of artists correctly', () => {
	const result = normalizeMbArtists([MbGreenDay, MbDaftPunk]);
	expect(result).toEqual([
		{
			id: '084308bd-1654-436f-ba03-df6697104e19',
			mbid: '084308bd-1654-436f-ba03-df6697104e19',
			name: 'Green Day',
			genres: [],
		},
		{
			id: '056e4f3e-d505-4dad-8ec1-d04f521cbb56',
			mbid: '056e4f3e-d505-4dad-8ec1-d04f521cbb56',
			name: 'Daft Punk',
			genres: [],
		},
	]);
});

it('NormalizeSpotifyArtist normalizes Green Day correctly', () => {
	const result = normalizeSpotifyArtist(SpGreenDay);
	expect(result).toEqual({
		id: '7oPftvlwr6VrsViSDV7fJY', // cspell:disable-line
		spotifyId: '7oPftvlwr6VrsViSDV7fJY', // cspell:disable-line
		name: 'Green Day',
		genres: [],
	});
});

it('NormalizeSpotifyArtist normalizes Daft Punk correctly', () => {
	const result = normalizeSpotifyArtist(SpDaftPunk);
	expect(result).toEqual({
		id: '4tZwfgrHOc3mvqYlEYSvVi', // cspell:disable-line
		spotifyId: '4tZwfgrHOc3mvqYlEYSvVi', // cspell:disable-line
		name: 'Daft Punk',
		genres: [],
	});
});

it('NormalizeSpotifyArtists normalizes an array of artists correctly', () => {
	const result = normalizeSpotifyArtists([SpGreenDay, SpDaftPunk]);
	expect(result).toEqual([
		{
			id: '7oPftvlwr6VrsViSDV7fJY', // cspell:disable-line
			spotifyId: '7oPftvlwr6VrsViSDV7fJY', // cspell:disable-line
			name: 'Green Day',
			genres: [],
		},
		{
			id: '4tZwfgrHOc3mvqYlEYSvVi', // cspell:disable-line
			spotifyId: '4tZwfgrHOc3mvqYlEYSvVi', // cspell:disable-line
			name: 'Daft Punk',
			genres: [],
		},
	]);
});

it('NormalizeSpotifyTrack normalizes Basket Case correctly', () => {
	const result = normalizeSpotifyTrack(SpBasketCase);
	expect(result).toEqual({
		id: '6L89mwZXS0wYl76YXfX13s',
		spotifyId: '6L89mwZXS0wYl76YXfX13s',
		title: 'Basket Case',
		artists: ['Green Day'],
	});
});

it('NormalizeSpotifyTrack normalizes Feel Good Inc. correctly', () => {
	const result = normalizeSpotifyTrack(SpFeelGoodInc);
	expect(result).toEqual({
		id: '0d28khcov6AiegSCpG5TuT', // cspell:disable-line
		spotifyId: '0d28khcov6AiegSCpG5TuT', // cspell:disable-line
		title: 'Feel Good Inc.',
		artists: ['Gorillaz', 'De La Soul'],
	});
});

it('NormalizeSpotifyTracks normalizes an array of tracks correctly', () => {
	const result = normalizeSpotifyTracks([SpBasketCase, SpFeelGoodInc]);
	expect(result).toEqual([
		{
			id: '6L89mwZXS0wYl76YXfX13s',
			spotifyId: '6L89mwZXS0wYl76YXfX13s',
			title: 'Basket Case',
			artists: ['Green Day'],
		},
		{
			id: '0d28khcov6AiegSCpG5TuT', // cspell:disable-line
			spotifyId: '0d28khcov6AiegSCpG5TuT', // cspell:disable-line
			title: 'Feel Good Inc.',
			artists: ['Gorillaz', 'De La Soul'],
		},
	]);
});
