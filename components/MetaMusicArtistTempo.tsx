'use client';

import { useState } from 'react';
import Button from '@/components/elements/Button';
import P from '@/components/elements/P';
import { GsbDaftPunk, GsbGreenDay, GsbShakira } from '@/mocks/GsbArtistMocks';
import { Artist } from '@/models/rhythmRun';
import { normalizeGsbArtist } from '@/lib/normalize';
import { useMetaMusicArtistTempo } from '@/hooks/api/useMetaMusic';
import { useSet } from '@/hooks/useSet';

const normalDaftPunk = normalizeGsbArtist(GsbDaftPunk);
const normalGreenDay = normalizeGsbArtist(GsbGreenDay);
const normalShakira = normalizeGsbArtist(GsbShakira);

export default function MetaMusicArtistTempo() {
	const [query, setQuery] = useState<string[]>([]);
	const { set: artists, add, clear: clearArtists } = useSet<Artist>();
	const { tracks, loading, error } = useMetaMusicArtistTempo(query);

	const addArtist = (artist: Artist) => {
		add(artist);
	};

	const clearAll = () => {
		clearArtists();
		setQuery([]);
	};

	const loadMbids = () => {
		setQuery(artists.flatMap((a) => (a.mbid ? [a.mbid] : [])));
	};

	return (
		<>
			{error && error}
			{loading && 'Loading...'}
			<P>
				<code>artists</code>: {artists.map((a) => a.name).join(', ')}
			</P>
			<P>
				<code>active</code>: {query.join(', ')}
			</P>
			<Button mini onClick={() => addArtist(normalDaftPunk)} type="button">
				Daft Punk
			</Button>
			<Button mini onClick={() => addArtist(normalGreenDay)} type="button">
				Green Day
			</Button>
			<Button mini onClick={() => addArtist(normalShakira)} type="button">
				Shakira
			</Button>
			<Button
				buttonStyle="black-white"
				mini
				onClick={() => loadMbids()}
				type="button"
			>
				Load
			</Button>
			<Button
				buttonStyle="black-white"
				mini
				onClick={() => clearAll()}
				type="button"
			>
				Clear
			</Button>
			{tracks &&
				tracks.map((tr) => (
					<P key={tr.id}>{`${tr.artists} - ${tr.title} - bpm: ${tr.bpm}`}</P>
				))}
		</>
	);
}
