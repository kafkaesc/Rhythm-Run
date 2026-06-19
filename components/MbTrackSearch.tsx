'use client';

import { useState } from 'react';
import Button from '@/components/elements/Button';
import Input from '@/components/elements/Input';
import Label from '@/components/elements/Label';
import ClearIcon from '@/components/icons/ClearIcon';
import SearchIcon from '@/components/icons/SearchIcon';
import TrackList from '@/components/TrackList';
import SearchStatus from '@/components/SearchStatus';
import { useMusicBrainzTrackSearch } from '@/hooks/api/useMusicBrainzApi';
import { normalizeMbTrack } from '@/lib/normalize';
import { MbTrack } from '@/models/musicBrainz';

type MbTrackSearchProps = Readonly<{
	add?: (track: MbTrack) => void;
	title?: string;
}>;

/**
 * Search form for querying the MusicBrainz API by track name.
 * Renders the response track list once the search completes.
 *
 * @param add - Optional callback to add a selected track from the search results
 * @param title - Overrides the default label
 */
export default function MbTrackSearch({ add, title }: MbTrackSearchProps) {
	const [input, setInput] = useState('');
	const [query, setQuery] = useState('');
	const { tracks, loading, error } = useMusicBrainzTrackSearch(query);

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
				<Label htmlFor="mb-track-search">{title || 'Track name'}</Label>
				<div className="flex items-center gap-2">
					<Input
						className="flex-1 min-w-0"
						aria-describedby="mb-track-search-status"
						id="mb-track-search"
						name="searchQuery"
						onChange={(e) => setInput(e.target.value)}
						placeholder="Find a track via MusicBrainz"
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
					errMessage="Error with the MusicBrainz response"
					id="mb-track-search-status"
					loading={loading}
				/>
			</form>
			<TrackList tracks={tracks} add={add} toTrack={normalizeMbTrack} />
		</div>
	);
}
