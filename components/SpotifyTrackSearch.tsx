'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import Button from '@/components/elements/Button';
import Input from '@/components/elements/Input';
import P from '@/components/elements/P';
import TrackList from '@/components/TrackList';
import { useSpotifyTrackSearch } from '@/hooks/useSpotifyApi';
import { NormalizeSpotifyTrack } from '@/lib/normalize';
import { SpotifyTrack } from '@/models/spotify';

const ClearIcon = () => <Icon icon="lucide:x-circle" aria-hidden="true" />;
const SearchIcon = () => (
	<Icon icon="lucide:search" aria-hidden="true" className="-translate-y-px" />
);

type StatusProps = {
	err: string | null;
	loading: boolean | null;
};

/**
 * Helper component to display the loading and error status of the Spotify search
 * @param err - Error message, if any
 * @param loading - True if the search is currently loading
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

type SpotifyTrackSearchProps = {
	add?: (track: SpotifyTrack) => void;
};

/**
 * Search form for querying the Spotify API by track name.
 * Renders the response track list once the search completes.
 */
export default function SpotifyTrackSearch({ add }: SpotifyTrackSearchProps) {
	const [input, setInput] = useState(''); // Updated per keystroke for local behavior
	const [query, setQuery] = useState(''); // Updated on form submit to trigger search
	const { tracks, loading, error } = useSpotifyTrackSearch(query);

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
						className="flex-1 min-w-0"
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
						<SearchIcon />
						<span className="hidden md:inline">Search</span>
					</Button>
					<Button
						aria-label="Clear search"
						buttonStyle="black-white"
						className="flex items-center gap-1"
						type="button"
						onClick={clear}
					>
						<ClearIcon />
						<span className="hidden md:inline">Clear</span>
					</Button>
				</div>
				<Status loading={loading} err={error} />
			</form>
			<TrackList tracks={tracks} add={add} toTrack={NormalizeSpotifyTrack} />
		</div>
	);
}
