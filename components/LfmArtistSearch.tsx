'use client';

import { useState } from 'react';
import Button from '@/components/elements/Button';
import Input from '@/components/elements/Input';
import Label from '@/components/elements/Label';
import ClearIcon from '@/components/icons/ClearIcon';
import SearchIcon from '@/components/icons/SearchIcon';
import ArtistSearchList from '@/components/ArtistSearchList';
import SearchStatus from '@/components/SearchStatus';
import { useLastFmArtistSearch } from '@/hooks/api/useLastFmApi';
import { LfmArtist } from '@/models/lastFm';

type LfmArtistSearchProps = {
	add?: (artist: LfmArtist) => void;
	remove?: (artist: LfmArtist) => void;
	selected?: LfmArtist[];
	title?: string;
};

/**
 * Search form for querying the Last.fm API by artist name.
 * Renders the response artist list once the search completes.
 *
 * @param add - Optional callback to add a selected artist from the search results
 * @param remove - Optional callback to remove a selected artist
 * @param selected - Artists already selected; shown at top of list and excluded from results
 * @param title - Overrides the default label
 */
export default function LfmArtistSearch({ add, remove, selected, title }: LfmArtistSearchProps) {
	const [input, setInput] = useState(''); // Updated per keystroke for local behavior
	const [query, setQuery] = useState(''); // Updated on form submit to trigger search
	const { artists, loading, error } = useLastFmArtistSearch(query);

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
				<Label htmlFor="lfm-artist-search">
					{title || 'Select up to 5 artists'}
				</Label>
				<div className="flex items-center gap-2">
					<Input
						className="flex-1 min-w-0"
						aria-describedby="lfm-artist-search-status"
						id="lfm-artist-search"
						name="searchQuery"
						onChange={(e) => setInput(e.target.value)}
						placeholder="Find an artist via Last.fm"
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
					id="lfm-artist-search-status"
					loading={loading}
				/>
			</form>
			<ArtistSearchList
				add={add}
				remove={remove}
				results={artists}
				selected={selected ?? []}
			/>
		</div>
	);
}
