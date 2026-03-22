'use client';

import { useState } from 'react';
import Input from '@/components/elements/Input';
import P from '@/components/elements/P';
import SpotifyTrackList from '@/components/SpotifyTrackList';
import { useSpotifyTrackSearch } from '@/hooks/useSpotifyApi';

type StatusProps = {
	err: string | null;
	loading: boolean | null;
};

/**
 * Helper component to display the loading and error status of the Spotify search
 * @param err - Error message, if any
 * @param loading - Whether the search is currently loading
 */
function Status({ err, loading }: StatusProps) {
	const hasDisplay = loading || err;
	return (
		<P className="px-2 text-small">
			{err && 'Error with the Spotify response'}
			{loading && 'Loading...'}
			{!hasDisplay && '\u00A0'}
		</P>
	);
}

/**
 * Search form for querying the Spotify API by track name.
 * Renders the response track list once the search completes.
 */
export default function SpotifySearch() {
	const [query, setQuery] = useState('');
	const { tracks, loading, error } = useSpotifyTrackSearch(query);

	function onSubmit(ev: React.SyntheticEvent<HTMLFormElement>) {
		ev.preventDefault();

		// If a previous search is still running, don't trigger another
		if (loading) return;

		// Get the search query from the form data
		const data = new FormData(ev.currentTarget);
		const searchQuery = data.get('searchQuery');

		// The search query should be a string, if not
		// the hook might need to be revisited
		if (typeof searchQuery !== 'string') return;
		setQuery(searchQuery);
	}

	return (
		<div>
			<form onSubmit={onSubmit}>
				<div className="flex items-center gap-2">
					<Input name="searchQuery" placeholder="Search Spotify" type="text" />
					<button type="submit">Search</button>
				</div>
				<Status loading={loading} err={error} />
			</form>
			<SpotifyTrackList tracks={tracks} />
		</div>
	);
}
