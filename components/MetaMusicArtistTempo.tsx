'use client';

import { useState } from 'react';
import Button from '@/components/elements/Button';
import P from '@/components/elements/P';
import ArtistList from '@/components/ArtistList';
import ArtistTempoQueryDisplay from '@/components/ArtistTempoQueryDisplay';
import BpmSelector from '@/components/BpmSelector';
import MbArtistSearch from '@/components/MbArtistSearch';
import SearchStatus from '@/components/SearchStatus';
import { useMetaMusicArtistTempo } from '@/hooks/api/useMetaMusic';
import { useSet } from '@/hooks/useSet';
import { normalizeMbArtist } from '@/lib/normalize';
import { MbArtist } from '@/models/musicBrainz';
import { MetaMusicArtistTempoQuery } from '@/models/metaMusic';

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
			<SearchStatus
				errMessage="Error with the MetaMusic response"
				loading={loading}
				err={error}
			/>
			{tracks &&
				tracks.map((tr) => (
					<P key={tr.id}>{`${tr.artists} - ${tr.title} - bpm: ${tr.bpm}`}</P>
				))}
		</>
	);
}
