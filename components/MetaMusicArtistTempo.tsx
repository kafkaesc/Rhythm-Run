'use client';

import { useState } from 'react';
import Button from '@/components/elements/Button';
import P from '@/components/elements/P';
import ArtistList from '@/components/ArtistList';
import BpmSelector from '@/components/BpmSelector';
import MbArtistSearch from '@/components/MbArtistSearch';
import { useMetaMusicArtistTempo } from '@/hooks/api/useMetaMusic';
import { useSet } from '@/hooks/useSet';
import { normalizeMbArtist } from '@/lib/normalize';
import { MbArtist } from '@/models/musicBrainz';
import { MetaMusicArtistTempoQuery } from '@/models/metaMusic';
import ArtistTempoQueryDisplay from './ArtistTempoQueryDisplay';

type StatusProps = {
	err: string | null;
	loading: boolean | null;
};

function Status({ err, loading }: StatusProps) {
	const hasDisplay = loading || err;
	return (
		<P className="px-2 text-sm">
			{err && 'Error with the MetaMusic response'}
			{loading && 'Loading...'}
			{!hasDisplay && '\u00A0'}
		</P>
	);
}

export default function MetaMusicArtistTempo() {
	const [mmQuery, setMmQuery] = useState<MetaMusicArtistTempoQuery | null>(
		null,
	);
	const [selectedTempo, setSelectedTempo] = useState(160);
	const {
		set: artists,
		add,
		remove,
		clear: clearArtists,
	} = useSet<MbArtist>({
		key: (a) => a.id,
		limit: 5,
	});
	const { tracks, loading, error } = useMetaMusicArtistTempo(
		mmQuery?.mbids ?? [],
		mmQuery?.tempo ?? null,
		mmQuery?.epsilon ?? null,
	);

	const clearAll = () => {
		clearArtists();
		setMmQuery(null);
	};

	const loadMbids = () => {
		setMmQuery({ mbids: artists.map((a) => a.id), tempo: selectedTempo });
	};

	return (
		<>
			<BpmSelector onChange={setSelectedTempo} />
			<MbArtistSearch add={add} />
			<ArtistList
				artists={artists}
				remove={remove}
				toArtist={normalizeMbArtist}
			/>
			<ArtistTempoQueryDisplay artists={artists} tempo={selectedTempo} />
			<Button buttonStyle="black-white" mini onClick={loadMbids} type="button">
				Load
			</Button>
			<Button buttonStyle="black-white" mini onClick={clearAll} type="button">
				Clear
			</Button>
			<Status loading={loading} err={error} />
			{tracks &&
				tracks.map((tr) => (
					<P key={tr.id}>{`${tr.artists} - ${tr.title} - bpm: ${tr.bpm}`}</P>
				))}
		</>
	);
}
