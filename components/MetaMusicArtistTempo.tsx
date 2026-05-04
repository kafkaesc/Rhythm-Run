'use client';

import { useState } from 'react';
import Button from '@/components/elements/Button';
import H2 from './elements/H2';
import P from '@/components/elements/P';
import ArtistList from '@/components/ArtistList';
import ArtistTempoQueryDisplay from '@/components/ArtistTempoQueryDisplay';
import BpmSelector from '@/components/BpmSelector';
import LfmArtistSearch from '@/components/LfmArtistSearch';
import SearchStatus from '@/components/SearchStatus';
import { useMetaMusicArtistTempo } from '@/hooks/api/useMetaMusic';
import { useSet } from '@/hooks/useSet';
import { normalizeLfmArtist } from '@/lib/normalize';
import { LfmArtist } from '@/models/lastFm';
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
	} = useSet<LfmArtist>({
		key: (a) => a.mbid || a.name,
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
		const mbids = artists.map((a) => a.mbid).filter(Boolean);
		setMmQuery({ mbids, tempo: selectedTempo });
	};

	return (
		<>
			<BpmSelector onChange={setSelectedTempo} />
			<LfmArtistSearch add={add} />
			<ArtistList
				artists={artists}
				remove={remove}
				toArtist={normalizeLfmArtist}
			/>

			<div className="flex flex-col items-center gap-2">
				<div>
					<ArtistTempoQueryDisplay artists={artists} tempo={selectedTempo} />
				</div>
				<div className="flex gap-3">
					<Button buttonStyle="black-white" onClick={loadMbids} type="button">
						Find Tracks
					</Button>
					<Button buttonStyle="black-white" onClick={clearAll} type="button">
						Clear All
					</Button>
				</div>
				<SearchStatus
					errMessage="Error with the MetaMusic response"
					loading={loading}
					err={error}
				/>
			</div>
			{tracks && (
				<>
					<H2>Matching Tracks</H2>
					{tracks.map((tr) => (
						<P key={tr.id}>{`${tr.artists} - ${tr.title} - bpm: ${tr.bpm}`}</P>
					))}
				</>
			)}
		</>
	);
}
