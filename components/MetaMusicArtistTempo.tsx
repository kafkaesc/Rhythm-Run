'use client';

import { useState } from 'react';
import ArtistTempoQueryDisplay from '@/components/metamusic-artist-tempo/ArtistTempoQueryDisplay';
import SearchControls from '@/components/metamusic-artist-tempo/SearchControls';
import TrackSelectionStep from '@/components/metamusic-artist-tempo/TrackSelectionStep';
import BpmSelector from '@/components/BpmSelector';
import EpsilonSelector from '@/components/EpsilonSelector';
import LfmArtistSearch from '@/components/LfmArtistSearch';
import SpotifyExportPanel from '@/components/SpotifyExportPanel';
import SuggestedArtistsCloud from '@/components/SuggestedArtistsCloud';
import { useMetaMusicArtistTempo } from '@/hooks/api/useMetaMusic';
import { useSet } from '@/hooks/useSet';
import { useTrackSelection } from '@/hooks/useTrackSelection';
import {
	DEFAULT_BPM,
	DEFAULT_EPSILON,
	MAX_SEARCH_ARTISTS,
} from '@/lib/constants';
import { LfmArtist } from '@/models/lastFm';
import { MetaMusicArtistTempoQuery } from '@/models/metaMusic';

type UiStep = 'search' | 'results' | 'export';

/**
 * Top-level feature component for the MetaMusic artist tempo search.
 *
 * Manages a three-step flow:
 * 1. Artist + tempo search
 * 2. Track selection
 * 3. Spotify playlist export
 */
export default function MetaMusicArtistTempo() {
	// UI state
	const [step, setStep] = useState<UiStep>('search');

	// Search state
	const [mmQuery, setMmQuery] = useState<MetaMusicArtistTempoQuery | null>(
		null,
	);
	const [tempo, setTempo] = useState(DEFAULT_BPM);
	const [epsilon, setEpsilon] = useState(DEFAULT_EPSILON);
	const {
		set: artists,
		add,
		isFull,
		remove,
	} = useSet<LfmArtist>({
		key: (a) => a.mbid || a.name,
		limit: MAX_SEARCH_ARTISTS,
	});

	// Search results
	const { tracks, loading, streaming, error } = useMetaMusicArtistTempo(
		mmQuery?.mbids ?? [],
		mmQuery?.tempo ?? null,
		mmQuery?.epsilon ?? null,
	);

	// Track selection
	const {
		selectedIds,
		selectedTracks,
		toggle,
		clear: clearSelection,
	} = useTrackSelection(tracks);

	const clearResults = () => {
		setStep('search');
		setMmQuery(null);
		clearSelection();
	};

	const loadMbids = () => {
		const mbids = artists.map((a) => a.mbid).filter(Boolean);
		setMmQuery({ mbids, tempo, epsilon });
		setStep('results');
	};

	return (
		<div className="flex flex-col gap-4">
			{step === 'search' && (
				<>
					<div className="flex flex-col sm:flex-row gap-3">
						<div className="flex-1">
							<BpmSelector initialVal={tempo} onChange={setTempo} />
						</div>
						<div className="shrink-0">
							<EpsilonSelector initialVal={epsilon} onChange={setEpsilon} />
						</div>
					</div>
					<SuggestedArtistsCloud isFull={isFull()} onSelect={add} />
					<LfmArtistSearch add={add} remove={remove} selected={artists} />
				</>
			)}
			{(step === 'search' || step === 'results') && (
				<>
					<ArtistTempoQueryDisplay
						artists={artists}
						epsilon={epsilon}
						tempo={tempo}
					/>
					<SearchControls
						artistCount={mmQuery?.mbids.length ?? 0}
						disabled={artists.length === 0}
						error={error}
						loading={loading}
						onClear={clearResults}
						onFind={loadMbids}
						streaming={streaming}
					/>
				</>
			)}
			{step === 'results' && tracks && (
				<TrackSelectionStep
					onNext={() => setStep('export')}
					onToggleSelect={toggle}
					selectedIds={selectedIds}
					title="Matching Tracks"
					tracks={tracks}
				/>
			)}
			{step === 'export' && (
				<SpotifyExportPanel
					onBack={() => setStep('results')}
					onSuccess={clearSelection}
					tracks={selectedTracks}
				/>
			)}
		</div>
	);
}
