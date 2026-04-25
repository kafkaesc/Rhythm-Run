import { NormalizeGsbTrack, NormalizeSpotifyTrack } from './normalize';
import { GsbBasketCase, GsbFeelGoodInc } from '@/mocks/GsbTrackMocks';
import { SpBasketCase, SpFeelGoodInc } from '@/mocks/SpotifyTrackMocks';

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
