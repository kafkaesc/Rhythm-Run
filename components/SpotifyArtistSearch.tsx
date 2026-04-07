'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import Button from '@/components/elements/Button';
import Input from '@/components/elements/Input';
import P from '@/components/elements/P';
import SpotifyArtistList from '@/components/SpotifyArtistList';
import { useSpotifyArtistSearch } from '@/hooks/useSpotifyApi';
import { SpotifyArtist } from '@/models/spotify';

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
		<P className="px-2 text-sm">
			{err && 'Error with the Spotify response'}
			{loading && 'Loading...'}
			{!hasDisplay && '\u00A0'}
		</P>
	);
}

type SpotifyArtistSearchProps = {
	add?: (artist: SpotifyArtist) => void;
};

/**
 * Search form for querying the Spotify API by artist name.
 * Renders the response artist list once the search completes.
 */
export default function SpotifyArtistSearch({ add }: SpotifyArtistSearchProps) {
	const [input, setInput] = useState(''); // Updated per keystroke for local behavior
	const [query, setQuery] = useState(''); // Updated on form submit to trigger search
	const { artists, loading, error } = useSpotifyArtistSearch(query);

	function onSubmit(ev: React.SyntheticEvent<HTMLFormElement>) {
		ev.preventDefault();

		// If a previous search is still running, don't trigger another
		if (loading) return;

		setQuery(input);
	}

	function clear() {
		setInput('');
		setQuery('');
	}

	return (
		<div>
			<form onSubmit={onSubmit}>
				<div className="flex items-center gap-2">
					<Input
						name="searchQuery"
						onChange={(e) => setInput(e.target.value)}
						placeholder="Search Spotify"
						type="text"
						value={input}
					/>
					<Button
						className="flex items-center gap-1"
						disabled={input.length === 0}
						type="submit"
					>
						<Icon
							icon="lucide:search"
							aria-hidden="true"
							className="-translate-y-px"
						/>
						Search
					</Button>
					<Button buttonStyle="black-white" type="button" onClick={clear}>
						Clear
					</Button>
				</div>
				<Status loading={loading} err={error} />
			</form>
			<SpotifyArtistList artists={artists} add={add} />
		</div>
	);
}
