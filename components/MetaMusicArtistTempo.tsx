'use client';

import { useState } from 'react';
import Button from '@/components/elements/Button';
import H2 from '@/components/elements/H2';
import ArtistTempoQueryDisplay from '@/components/ArtistTempoQueryDisplay';
import BpmSelector from '@/components/BpmSelector';
import EpsilonSelector from '@/components/EpsilonSelector';
import LfmArtistSearch from '@/components/LfmArtistSearch';
import LoadingMessages from '@/components/LoadingMessages';
import SearchStatus from '@/components/SearchStatus';
import TrackTable from '@/components/TrackTable';
import { useMetaMusicArtistTempo } from '@/hooks/api/useMetaMusic';
import { useSet } from '@/hooks/useSet';
import { DEFAULT_BPM, DEFAULT_EPSILON } from '@/lib/constants';
import { LfmArtist } from '@/models/lastFm';
import { MetaMusicArtistTempoQuery } from '@/models/metaMusic';

export default function MetaMusicArtistTempo() {
	const [mmQuery, setMmQuery] = useState<MetaMusicArtistTempoQuery | null>(
		null,
	);
	const [tempo, setTempo] = useState(DEFAULT_BPM);
	const [epsilon, setEpsilon] = useState(DEFAULT_EPSILON);
	const {
		set: artists,
		add,
		remove,
	} = useSet<LfmArtist>({
		key: (a) => a.mbid || a.name,
		limit: 5,
	});
	const { tracks, loading, streaming, error } = useMetaMusicArtistTempo(
		mmQuery?.mbids ?? [],
		mmQuery?.tempo ?? null,
		mmQuery?.epsilon ?? null,
	);

	const clearResults = () => {
		setMmQuery(null);
	};

	const loadMbids = () => {
		const mbids = artists.map((a) => a.mbid).filter(Boolean);
		setMmQuery({ mbids, tempo, epsilon });
	};

	return (
		<div className="flex flex-col gap-4">
			{!mmQuery && (
				<>
					<div className="flex flex-col sm:flex-row gap-3">
						<div className="flex-1">
							<BpmSelector onChange={setTempo} />
						</div>
						<div className="shrink-0">
							<EpsilonSelector onChange={setEpsilon} />
						</div>
					</div>
					<LfmArtistSearch add={add} remove={remove} selected={artists} />
				</>
			)}
			<div className="flex flex-col items-center gap-2">
				<div>
					<ArtistTempoQueryDisplay
						artists={artists}
						tempo={tempo}
						epsilon={epsilon}
					/>
				</div>
				<div className="flex gap-3">
					<Button
						buttonStyle="primary"
						disabled={artists.length === 0}
						onClick={loadMbids}
						type="button"
					>
						Find Tracks
					</Button>
					<Button
						buttonStyle="black-white"
						onClick={clearResults}
						type="button"
					>
						Clear Results
					</Button>
				</div>
				<SearchStatus
					err={error}
					errMessage="Error with the MetaMusic response"
					loading={loading}
					streaming={streaming}
					streamingMessage={<LoadingMessages />}
				/>
			</div>
			{tracks && (
				<>
					<H2>Matching Tracks</H2>
					<TrackTable tracks={tracks} />
				</>
			)}
		</div>
	);
}
