'use client';

import { useState } from 'react';
import Button from '@/components/elements/Button';
import Input from '@/components/elements/Input';
import Label from '@/components/elements/Label';
import ClearIcon from '@/components/icons/ClearIcon';
import SearchIcon from '@/components/icons/SearchIcon';
import ArtistList from '@/components/ArtistList';
import SearchStatus from '@/components/SearchStatus';
import { useGsbArtistSearch } from '@/hooks/api/useGetSongBpmApi';
import { normalizeGsbArtist } from '@/lib/normalize';
import { GsbArtist } from '@/models/getSongBpm';

type GsbArtistSearchProps = Readonly<{
	add?: (artist: GsbArtist) => void;
	title?: string;
}>;

/**
 * Search form for querying the GetSongBPM API by artist name.
 * Renders the response artist list once the search completes.
 *
 * @param add - Optional callback to add a selected artist from the search results
 * @param title - Overrides the default label
 */
export default function GsbArtistSearch({ add, title }: GsbArtistSearchProps) {
	const [input, setInput] = useState('');
	const [query, setQuery] = useState('');
	const { artists, loading, error } = useGsbArtistSearch(query);

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
				<Label htmlFor="gsb-artist-search">{title || 'Artist name'}</Label>
				<div className="flex items-center gap-2">
					<Input
						className="flex-1 min-w-0"
						aria-describedby="gsb-artist-search-status"
						id="gsb-artist-search"
						name="searchQuery"
						onChange={(e) => setInput(e.target.value)}
						placeholder="Find an artist via GetSongBPM"
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
					errMessage="Error with the GetSongBPM response"
					id="gsb-artist-search-status"
					loading={loading}
				/>
			</form>
			<ArtistList add={add} artists={artists} toArtist={normalizeGsbArtist} />
		</div>
	);
}
