'use client';

import { useState } from 'react';
import Button from '@/components/elements/Button';
import Input from '@/components/elements/Input';
import ClearIcon from '@/components/icons/ClearIcon';
import SearchIcon from '@/components/icons/SearchIcon';
import TrackList from '@/components/TrackList';
import SearchStatus from '@/components/SearchStatus';
import { useLastFmTrackSearch } from '@/hooks/api/useLastFmApi';
import { normalizeLfmSearchTrack } from '@/lib/normalize';
import { LfmSearchTrack } from '@/models/lastFm';

type LfmSearchTrackSearchProps = {
	add?: (track: LfmSearchTrack) => void;
	title?: string;
};

/**
 * Search form for querying the Last.fm API by track name.
 * Renders the response track list once the search completes.
 *
 * @param add - Optional callback to add a selected track from the search results
 * @param title - Overrides the default label
 */
export default function LfmTrackSearch({
	add,
	title,
}: LfmSearchTrackSearchProps) {
	const [input, setInput] = useState('');
	const [query, setQuery] = useState('');
	const { tracks, loading, error } = useLastFmTrackSearch(query);

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
				<label htmlFor="lfm-track-search" className="text-2xl font-bold">
					{title || 'Track name'}
				</label>
				<div className="flex items-center gap-2">
					<Input
						className="flex-1 min-w-0"
						aria-describedby="lfm-track-search-status"
						id="lfm-track-search"
						name="searchQuery"
						onChange={(e) => setInput(e.target.value)}
						placeholder="Find a track via Last.fm"
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
					errMessage="Error with the Last.fm response"
					id="lfm-track-search-status"
					loading={loading}
				/>
			</form>
			<TrackList tracks={tracks} add={add} toTrack={normalizeLfmSearchTrack} />
		</div>
	);
}
