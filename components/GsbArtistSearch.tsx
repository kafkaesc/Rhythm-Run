'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import Button from '@/components/elements/Button';
import Input from '@/components/elements/Input';
import ArtistList from '@/components/ArtistList';
import SearchStatus from '@/components/SearchStatus';
import { useGsbArtistSearch } from '@/hooks/api/useGetSongBpmApi';
import { normalizeGsbArtist } from '@/lib/normalize';
import { GsbArtist } from '@/models/getSongBpm';

const ClearIcon = () => <Icon icon="lucide:x-circle" aria-hidden="true" />;
const SearchIcon = () => (
	<Icon icon="lucide:search" aria-hidden="true" className="-translate-y-px" />
);

type GsbArtistSearchProps = {
	add?: (artist: GsbArtist) => void;
};

/**
 * Search form for querying the GetSongBPM API by artist name.
 * Renders the response artist list once the search completes.
 */
export default function GsbArtistSearch({ add }: GsbArtistSearchProps) {
	const [input, setInput] = useState('');
	const [query, setQuery] = useState('');
	const { artists, loading, error } = useGsbArtistSearch(query);

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
						placeholder="Find an artist via GetSongBPM"
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
					errMessage="Error with the GetSongBPM response"
					loading={loading}
				/>
			</form>
			<ArtistList add={add} artists={artists} toArtist={normalizeGsbArtist} />
		</div>
	);
}
