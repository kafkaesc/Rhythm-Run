'use client';

import { useState } from 'react';
import Button from '@/components/elements/Button';
import Input from '@/components/elements/Input';
import ClearIcon from '@/components/icons/ClearIcon';
import SearchIcon from '@/components/icons/SearchIcon';
import ArtistList from '@/components/ArtistList';
import SearchStatus from '@/components/SearchStatus';
import { useLastFmArtistSearch } from '@/hooks/api/useLastFmApi';
import { LfmArtist } from '@/models/lastFm';
import { normalizeLfmArtist } from '@/lib/normalize';

type LfmArtistSearchProps = {
	add?: (artist: LfmArtist) => void;
	title?: string;
};

export default function LfmArtistSearch({ add, title }: LfmArtistSearchProps) {
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
		<fieldset className="border-0 m-0 min-w-0 p-0">
			<legend className="text-2xl font-bold">
				{title || 'Select up to 5 artists'}
			</legend>
			<form onSubmit={onSubmit}>
				<label htmlFor="lfm-artist-search" className="sr-only">
					Artist name
				</label>
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
			<ArtistList add={add} artists={artists} toArtist={normalizeLfmArtist} />
		</fieldset>
	);
}
