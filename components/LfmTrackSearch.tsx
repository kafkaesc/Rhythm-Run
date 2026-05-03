'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import Button from '@/components/elements/Button';
import Input from '@/components/elements/Input';
import TrackList from '@/components/TrackList';
import SearchStatus from '@/components/SearchStatus';
import { normalizeLfmSearchTrack } from '@/lib/normalize';
import { LfmSearchTrack } from '@/models/lastFm';
import { useLastFmTrackSearch } from '@/hooks/api/useLastFmApi';

const ClearIcon = () => <Icon icon="lucide:x-circle" aria-hidden="true" />;
const SearchIcon = () => (
	<Icon icon="lucide:search" aria-hidden="true" className="-translate-y-px" />
);

type LfmSearchTrackSearchProps = {
	add?: (track: LfmSearchTrack) => void;
};

export default function LfmTrackSearch({ add }: LfmSearchTrackSearchProps) {
	const [input, setInput] = useState('');
	const [query, setQuery] = useState('');
	const { tracks, loading, error } = useLastFmTrackSearch(query);

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
				<div className="flex items-center gap-2">
					<Input
						className="flex-1 min-w-0"
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
				<SearchStatus
					err={error}
					errMessage="Error with the Last.fm response"
					loading={loading}
				/>
			</form>
			<TrackList tracks={tracks} add={add} toTrack={normalizeLfmSearchTrack} />
		</div>
	);
}
