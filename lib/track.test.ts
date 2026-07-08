import { isTrack } from './track';

it('Has isTrack accept a record with id, title, and string artists', () => {
	const result = isTrack({
		artists: ['Green Day'],
		id: '1',
		title: 'Basket Case',
	});
	expect(result).toBe(true);
});

it('Has isTrack accept a record with optional fields present', () => {
	const result = isTrack({
		artists: ['Gorillaz'],
		bpm: 138,
		id: '1',
		mbid: 'mbid-gorillaz-feel-good-inc',
		title: 'Feel Good Inc.',
	});
	expect(result).toBe(true);
});

it('Has isTrack accept a record with an empty artists array', () => {
	const result = isTrack({ artists: [], id: '1', title: 'X' });
	expect(result).toBe(true);
});

it('Has isTrack reject null', () => {
	const result = isTrack(null);
	expect(result).toBe(false);
});

it('Has isTrack reject a non-object', () => {
	const result = isTrack('not a track');
	expect(result).toBe(false);
});

it('Has isTrack reject a record missing id', () => {
	const result = isTrack({ artists: ['A'], title: 'X' });
	expect(result).toBe(false);
});

it('Has isTrack reject a record missing title', () => {
	const result = isTrack({ artists: ['A'], id: '1' });
	expect(result).toBe(false);
});

it('Has isTrack reject a record whose artists is not an array', () => {
	const result = isTrack({ artists: 'Green Day', id: '1', title: 'X' });
	expect(result).toBe(false);
});

it('Has isTrack reject a record whose artists contains a non-string', () => {
	const result = isTrack({ artists: ['A', 2], id: '1', title: 'X' });
	expect(result).toBe(false);
});

it('Has isTrack reject an error sentinel object', () => {
	const result = isTrack({ error: 'rate limited' });
	expect(result).toBe(false);
});
