'use client';

import { useState } from 'react';
import Button from '@/components/elements/Button';
import Input from '@/components/elements/Input';
import ClearIcon from '@/components/icons/ClearIcon';
import SearchIcon from '@/components/icons/SearchIcon';
import ArtistList from '@/components/ArtistList';
import SearchStatus from '@/components/SearchStatus';
import { useMusicBrainzArtistSearch } from '@/hooks/api/useMusicBrainzApi';
import { MbArtist } from '@/models/musicBrainz';
import { normalizeMbArtist } from '@/lib/normalize';

type MbArtistSearchProps = {
	add?: (artist: MbArtist) => void;
};

export default function MbArtistSearch({ add }: MbArtistSearchProps) {
	const [input, setInput] = useState(''); // Updated per keystroke for local behavior
	const [query, setQuery] = useState(''); // Updated on form submit to trigger search
	const { artists, loading, error } = useMusicBrainzArtistSearch(query);

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
				<div className="flex items-center gap-2">
					<Input
						className="flex-1 min-w-0"
						name="searchQuery"
						onChange={(e) => setInput(e.target.value)}
						placeholder="Find an artist via MusicBrainz"
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
					errMessage="Error with the MusicBrainz response"
					loading={loading}
				/>
			</form>
			<ArtistList add={add} artists={artists} toArtist={normalizeMbArtist} />
		</div>
	);
}
