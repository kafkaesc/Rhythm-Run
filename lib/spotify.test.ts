import { getRandomSpotifyTopArtists, getSpotifyTopArtists } from './spotify';
import { SpotifyArtist } from '@/models/spotify';

function makeArtist(name: string): SpotifyArtist {
	return {
		external_urls: { spotify: `https://open.spotify.com/artist/${name}` },
		id: name,
		images: [],
		name,
	};
}

const TEN_ARTISTS = Array.from({ length: 10 }, (_, i) =>
	makeArtist(`artist-${i}`),
);

// getSpotifyTopArtists

it('Returns empty array when artists is undefined', () => {
	const result = getSpotifyTopArtists(undefined, 3);
	expect(result).toEqual([]);
});

it('Returns the first n artists in order', () => {
	const result = getSpotifyTopArtists(TEN_ARTISTS, 3);
	expect(result).toEqual(TEN_ARTISTS.slice(0, 3));
});

it('Returns all artists when count exceeds available', () => {
	const result = getSpotifyTopArtists(TEN_ARTISTS, 20);
	expect(result).toEqual(TEN_ARTISTS);
});

it('Clamps count below 1 to 1', () => {
	const result = getSpotifyTopArtists(TEN_ARTISTS, 0);
	expect(result).toHaveLength(1);
});

it('Clamps count above 50 to 50', () => {
	const artists = Array.from({ length: 50 }, (_, i) => makeArtist(`artist-${i}`));
	const result = getSpotifyTopArtists(artists, 100);
	expect(result).toHaveLength(50);
});

it('Returns 1 artist by default', () => {
	const result = getSpotifyTopArtists(TEN_ARTISTS);
	expect(result).toHaveLength(1);
});

// getRandomSpotifyTopArtists

it('Returns empty array when artists is undefined (random)', () => {
	const result = getRandomSpotifyTopArtists(undefined, 3);
	expect(result).toEqual([]);
});

it('Returns the correct number of artists', () => {
	const result = getRandomSpotifyTopArtists(TEN_ARTISTS, 4);
	expect(result).toHaveLength(4);
});

it('Returns only artists from the original pool', () => {
	const result = getRandomSpotifyTopArtists(TEN_ARTISTS, 5);
	result.forEach((artist) => expect(TEN_ARTISTS).toContainEqual(artist));
});

it('Returns no duplicates', () => {
	const result = getRandomSpotifyTopArtists(TEN_ARTISTS, 10);
	const ids = result.map((a) => a.id);
	expect(new Set(ids).size).toBe(ids.length);
});

it('Returns all artists when count exceeds available (random)', () => {
	const result = getRandomSpotifyTopArtists(TEN_ARTISTS, 20);
	expect(result).toHaveLength(TEN_ARTISTS.length);
});

it('Clamps count below 1 to 1 (random)', () => {
	const result = getRandomSpotifyTopArtists(TEN_ARTISTS, 0);
	expect(result).toHaveLength(1);
});

it('Returns 1 artist by default (random)', () => {
	const result = getRandomSpotifyTopArtists(TEN_ARTISTS);
	expect(result).toHaveLength(1);
});
