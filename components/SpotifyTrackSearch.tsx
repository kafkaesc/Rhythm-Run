'use client';

import { useState } from 'react';
import Button from '@/components/elements/Button';
import Input from '@/components/elements/Input';
import ClearIcon from '@/components/icons/ClearIcon';
import SearchIcon from '@/components/icons/SearchIcon';
import TrackList from '@/components/TrackList';
import SearchStatus from '@/components/SearchStatus';
import { useSpotifyTrackSearch } from '@/hooks/api/useSpotifyApi';
import { normalizeSpotifyTrack } from '@/lib/normalize';
import { SpotifyTrack } from '@/models/spotify';

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
				<label htmlFor="spotify-track-search" className="sr-only">
					Track name
				</label>
				<div className="flex items-center gap-2">
					<Input
						className="flex-1 min-w-0"
						id="spotify-track-search"
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
						<SearchIcon aria-hidden="true" />
						<span className="hidden md:inline">Search</span>
					</Button>
					<Button
						aria-label="Clear search"
						buttonStyle="black-white"
						className="flex items-center gap-1"
						type="button"
						onClick={clear}
					>
						<ClearIcon aria-hidden="true" />
						<span className="hidden md:inline">Clear</span>
					</Button>
				</div>
				<SearchStatus
					err={error}
					errMessage="Error with the Spotify response"
					loading={loading}
				/>
			</form>
			<TrackList tracks={tracks} add={add} toTrack={normalizeSpotifyTrack} />
		</div>
	);
}
