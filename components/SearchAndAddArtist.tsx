'use client';

import H2 from '@/components/elements/H2';
import SpotifyArtistList from '@/components/SpotifyArtistList';
import SpotifyArtistSearch from '@/components/SpotifyArtistSearch';
import { useSet } from '@/hooks/useSet';
import { SpotifyArtist } from '@/models/spotify';

type SearchAndAddArtistProps = {
	title?: string;
};

export default function SearchAndAddArtist({ title }: SearchAndAddArtistProps) {
	const {
		set: selection,
		add,
		remove,
	} = useSet<SpotifyArtist>({ limit: 5, key: (artist) => artist.id });

	return (
		<>
			<H2>{title || 'Search and Add Artists'}</H2>
			<h3>Searched Options</h3>
			{/* The list of results from the latest Spotify search */}
			<SpotifyArtistSearch add={add} />
			<h3>Selected</h3>
			{/* The list of artists the user has selected from search results */}
			<SpotifyArtistList artists={selection} remove={remove} />
		</>
	);
}
