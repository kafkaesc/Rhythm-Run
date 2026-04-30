'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import Button from '@/components/elements/Button';
import Input from '@/components/elements/Input';
import P from '@/components/elements/P';
import TrackList from '@/components/TrackList';
import { useMusicBrainzTrackSearch } from '@/hooks/useMusicBrainzApi';
import { MbTrack } from '@/models/musicBrainz';
import { NormalizeMbTrack } from '@/lib/normalize';

const ClearIcon = () => <Icon icon="lucide:x-circle" aria-hidden="true" />;
const SearchIcon = () => (
	<Icon icon="lucide:search" aria-hidden="true" className="-translate-y-px" />
);

type StatusProps = {
	err: string | null;
	loading: boolean | null;
};

/**
 * Helper component to display the loading and error status
 * of the MusicBrainz search
 * @param err - Error message, if any
 * @param loading - True if the search is currently loading
 */
function Status({ err, loading }: StatusProps) {
	const hasDisplay = loading || err;
	return (
		<P className="px-2 text-sm">
			{err && 'Error with the MusicBrainz response'}
			{loading && 'Loading...'}
			{!hasDisplay && '\u00A0'}
		</P>
	);
}

type MbTrackSearchProps = {
	add?: (track: MbTrack) => void;
};

export default function MbTrackSearch({ add }: MbTrackSearchProps) {
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
				<div className="flex items-center gap-2">
					<Input
						className="flex-1 min-w-0"
						name="searchQuery"
						onChange={(e) => setInput(e.target.value)}
						placeholder="Find a track via MusicBrainz"
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
			<TrackList tracks={tracks} add={add} toTrack={NormalizeMbTrack} />
		</div>
	);
}
