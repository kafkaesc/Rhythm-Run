'use client';

import H2 from '@/components/elements/H2';
import SpotifyTrackList from '@/components/SpotifyTrackList';
import SpotifyTrackSearch from '@/components/SpotifyTrackSearch';
import { useSet } from '@/hooks/useSet';
import { SpotifyTrack } from '@/models/spotify';

type SearchAndAddTrackProps = {
	title?: string;
};

export default function SearchAndAddTrack({ title }: SearchAndAddTrackProps) {
	const {
		set: selection,
		add,
		remove,
	} = useSet<SpotifyTrack>({ limit: 5, key: (track) => track.id });

	return (
		<>
			<H2>{title || 'Search and Add Tracks'}</H2>
			<h3>Searched Options</h3>
			{/* The list of results from the latest Spotify search */}
			<SpotifyTrackSearch add={add} />
			<h3>Selected</h3>
			{/* The list of tracks the user has selected from search results */}
			<SpotifyTrackList tracks={selection} remove={remove} />
		</>
	);
}
