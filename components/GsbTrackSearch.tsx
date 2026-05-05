'use client';

import { useState } from 'react';
import Button from '@/components/elements/Button';
import Input from '@/components/elements/Input';
import ClearIcon from '@/components/icons/ClearIcon';
import SearchIcon from '@/components/icons/SearchIcon';
import SearchStatus from '@/components/SearchStatus';
import TrackList from '@/components/TrackList';
import { useGsbSongSearch } from '@/hooks/api/useGetSongBpmApi';
import { normalizeGsbTrack } from '@/lib/normalize';
import { GsbSong } from '@/models/getSongBpm';

type GsbTrackSearchProps = {
	add?: (track: GsbSong) => void;
};

/**
 * Search form for querying the GetSongBPM API by track name.
 * Renders the response track list once the search completes.
 */
export default function GsbTrackSearch({ add }: GsbTrackSearchProps) {
	const [input, setInput] = useState('');
	const [query, setQuery] = useState('');
	const { songs, loading, error } = useGsbSongSearch(query);

	function onSubmit(ev: React.SyntheticEvent<HTMLFormElement>) {
		ev.preventDefault();
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
				<label htmlFor="gsb-track-search" className="sr-only">
					Track name
				</label>
				<div className="flex items-center gap-2">
					<Input
						className="flex-1 min-w-0"
						id="gsb-track-search"
						name="searchQuery"
						onChange={(e) => setInput(e.target.value)}
						placeholder="Find a track via GetSongBPM"
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
					errMessage="Error with the GetSongBPM response"
					loading={loading}
				/>
			</form>
			<TrackList tracks={songs} add={add} toTrack={normalizeGsbTrack} />
		</div>
	);
}
