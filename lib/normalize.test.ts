import {
	NormalizeGsbArtist,
	NormalizeGsbArtists,
	NormalizeGsbTrack,
	NormalizeGsbTracks,
	NormalizeSpotifyArtist,
	NormalizeSpotifyArtists,
	NormalizeSpotifyTrack,
	NormalizeSpotifyTracks,
} from './normalize';
import { GsbGreenDay, GsbDaftPunk, GsbBadBunny } from '@/mocks/GsbArtistMocks';
import { GsbBasketCase, GsbFeelGoodInc } from '@/mocks/GsbTrackMocks';
import { SpGreenDay, SpDaftPunk } from '@/mocks/SpotifyArtistMocks';
import { SpBasketCase, SpFeelGoodInc } from '@/mocks/SpotifyTrackMocks';

it('NormalizeGsbArtist normalizes Green Day correctly', () => {
	const result = NormalizeGsbArtist(GsbGreenDay);
	expect(result).toEqual({
		id: 'v9M',
		getSongBpmId: 'v9M',
		mbid: '084308bd-1654-436f-ba03-df6697104e19',
		name: 'Green Day',
		genres: ['pop', 'punk', 'rock'],
	});
});

it('NormalizeGsbArtist normalizes an artist with null genres as an empty array', () => {
	const result = NormalizeGsbArtist(GsbBadBunny);
	expect(result.genres).toEqual([]);
});

it('NormalizeGsbArtist normalizes Daft Punk correctly', () => {
	const result = NormalizeGsbArtist(GsbDaftPunk);
	expect(result).toEqual({
		id: 'j0B',
		getSongBpmId: 'j0B',
		mbid: '056e4f3e-d505-4dad-8ec1-d04f521cbb56',
		name: 'Daft Punk',
		genres: ['electronic', 'funk', 'rock'],
	});
});

it('NormalizeGsbArtists normalizes an array of artists correctly', () => {
	const result = NormalizeGsbArtists([GsbGreenDay, GsbDaftPunk]);
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
	const result = NormalizeGsbTrack(GsbBasketCase);
	expect(result).toEqual({
		id: 'N7rQD',
		getSongBpmId: 'N7rQD',
		title: 'Basket Case',
		artists: ['Green Day'],
		bpm: 170,
	});
});

it('NormalizeGsbTrack normalizes Feel Good Inc. correctly', () => {
	const result = NormalizeGsbTrack(GsbFeelGoodInc);
	expect(result).toEqual({
		id: 'D95mAy',
		getSongBpmId: 'D95mAy',
		title: 'Feel Good Inc.',
		artists: ['Gorillaz'],
		bpm: 136,
	});
});

it('NormalizeGsbTracks normalizes an array of tracks correctly', () => {
	const result = NormalizeGsbTracks([GsbBasketCase, GsbFeelGoodInc]);
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

it('NormalizeSpotifyArtist normalizes Green Day correctly', () => {
	const result = NormalizeSpotifyArtist(SpGreenDay);
	expect(result).toEqual({
		id: '7oPftvlwr6VrsViSDV7fJY',
		spotifyId: '7oPftvlwr6VrsViSDV7fJY',
		name: 'Green Day',
		genres: [],
	});
});

it('NormalizeSpotifyArtist normalizes Daft Punk correctly', () => {
	const result = NormalizeSpotifyArtist(SpDaftPunk);
	expect(result).toEqual({
		id: '4tZwfgrHOc3mvqYlEYSvVi',
		spotifyId: '4tZwfgrHOc3mvqYlEYSvVi',
		name: 'Daft Punk',
		genres: [],
	});
});

it('NormalizeSpotifyArtists normalizes an array of artists correctly', () => {
	const result = NormalizeSpotifyArtists([SpGreenDay, SpDaftPunk]);
	expect(result).toEqual([
		{
			id: '7oPftvlwr6VrsViSDV7fJY',
			spotifyId: '7oPftvlwr6VrsViSDV7fJY',
			name: 'Green Day',
			genres: [],
		},
		{
			id: '4tZwfgrHOc3mvqYlEYSvVi',
			spotifyId: '4tZwfgrHOc3mvqYlEYSvVi',
			name: 'Daft Punk',
			genres: [],
		},
	]);
});

it('NormalizeSpotifyTrack normalizes Basket Case correctly', () => {
	const result = NormalizeSpotifyTrack(SpBasketCase);
	expect(result).toEqual({
		id: '6L89mwZXS0wYl76YXfX13s',
		spotifyId: '6L89mwZXS0wYl76YXfX13s',
		title: 'Basket Case',
		artists: ['Green Day'],
	});
});

it('NormalizeSpotifyTrack normalizes Feel Good Inc. correctly', () => {
	const result = NormalizeSpotifyTrack(SpFeelGoodInc);
	expect(result).toEqual({
		id: '0d28khcov6AiegSCpG5TuT',
		spotifyId: '0d28khcov6AiegSCpG5TuT',
		title: 'Feel Good Inc.',
		artists: ['Gorillaz', 'De La Soul'],
	});
});

it('NormalizeSpotifyTracks normalizes an array of tracks correctly', () => {
	const result = NormalizeSpotifyTracks([SpBasketCase, SpFeelGoodInc]);
	expect(result).toEqual([
		{
			id: '6L89mwZXS0wYl76YXfX13s',
			spotifyId: '6L89mwZXS0wYl76YXfX13s',
			title: 'Basket Case',
			artists: ['Green Day'],
		},
		{
			id: '0d28khcov6AiegSCpG5TuT',
			spotifyId: '0d28khcov6AiegSCpG5TuT',
			title: 'Feel Good Inc.',
			artists: ['Gorillaz', 'De La Soul'],
		},
	]);
});
