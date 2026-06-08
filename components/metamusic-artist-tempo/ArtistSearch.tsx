'use client';

import BpmSelector from '@/components/BpmSelector';
import EpsilonSelector from '@/components/EpsilonSelector';
import LfmArtistSearch from '@/components/LfmArtistSearch';
import SuggestedArtistsCloud from '@/components/SuggestedArtistsCloud';
import { LfmArtist } from '@/models/lastFm';

type ArtistSearchProps = {
	add: (artist: LfmArtist) => void;
	artists: LfmArtist[];
	epsilon: number;
	isFull: boolean;
	remove: (artist: LfmArtist) => void;
	setEpsilon: (val: number) => void;
	setTempo: (val: number) => void;
	tempo: number;
};

export default function ArtistSearch({
	add,
	artists,
	epsilon,
	isFull,
	remove,
	setEpsilon,
	setTempo,
	tempo,
}: ArtistSearchProps) {
	return (
		<>
			<div className="flex flex-col sm:flex-row gap-3">
				<div className="flex-1">
					<BpmSelector initialVal={tempo} onChange={setTempo} />
				</div>
				<div className="shrink-0">
					<EpsilonSelector initialVal={epsilon} onChange={setEpsilon} />
				</div>
			</div>
			<SuggestedArtistsCloud isFull={isFull} onSelect={add} />
			<LfmArtistSearch add={add} remove={remove} selected={artists} />
		</>
	);
}
