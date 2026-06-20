'use client';

import { useState } from 'react';
import Button from '@/components/elements/Button';
import Input from '@/components/elements/Input';
import Label from '@/components/elements/Label';
import ClearIcon from '@/components/icons/ClearIcon';
import SearchIcon from '@/components/icons/SearchIcon';
import TrackList from '@/components/TrackList';
import SearchStatus from '@/components/SearchStatus';
import { useSpotifyTrackSearch } from '@/hooks/api/useSpotifyApi';
import { normalizeSpotifyTrack } from '@/lib/normalize';
import { SpotifyTrack } from '@/models/spotify';

type SpotifyTrackSearchProps = Readonly<{
	add?: (track: SpotifyTrack) => void;
	title?: string;
}>;

/**
 * Search form for querying the Spotify API by track name.
 * Renders the response track list once the search completes.
 *
 * @param add - Optional callback to add a selected track from the search results
 * @param title - Overrides the default label
 */
export default function SpotifyTrackSearch({
	add,
	title,
}: SpotifyTrackSearchProps) {
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
				<Label htmlFor="spotify-track-search">{title || 'Track name'}</Label>
				<div className="flex items-center gap-2">
					<Input
						className="flex-1 min-w-0"
						aria-describedby="spotify-track-search-status"
						id="spotify-track-search"
						name="searchQuery"
						onChange={(e) => setInput(e.target.value)}
						placeholder="Search Spotify"
						type="text"
						value={input}
					/>
					<Button
						disabled={input.length === 0}
						icon={<SearchIcon aria-hidden="true" />}
						type="submit"
					>
						<span className="hidden md:inline">Search</span>
					</Button>
					<Button
						aria-label="Clear search"
						buttonStyle="black-white"
						icon={<ClearIcon aria-hidden="true" />}
						onClick={clear}
						type="button"
					>
						<span className="hidden md:inline">Clear</span>
					</Button>
				</div>
				<SearchStatus
					err={error}
					errMessage="Error with the Spotify response"
					id="spotify-track-search-status"
					loading={loading}
				/>
			</form>
			<TrackList tracks={tracks} add={add} toTrack={normalizeSpotifyTrack} />
		</div>
	);
}
