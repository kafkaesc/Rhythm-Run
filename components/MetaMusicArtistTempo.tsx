'use client';

import { useState, useCallback } from 'react';
import ArtistSearch from '@/components/metamusic-artist-tempo/ArtistSearch';
import SearchControls from '@/components/metamusic-artist-tempo/SearchControls';
import ResultsStep from '@/components/metamusic-artist-tempo/ResultsStep';
import SpotifyExportPanel from '@/components/SpotifyExportPanel';
import { useMetaMusicArtistTempo } from '@/hooks/api/useMetaMusic';
import { useSet } from '@/hooks/useSet';
import { DEFAULT_BPM, DEFAULT_EPSILON, MAX_SEARCH_ARTISTS } from '@/lib/constants';
import { LfmArtist } from '@/models/lastFm';
import { MetaMusicArtistTempoQuery } from '@/models/metaMusic';

type UiStep = 'search' | 'results' | 'export';

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

	// Mark state
	const [markedTrackIds, setMarkedTrackIds] = useState<Set<string>>(new Set());
	const clearMarks = useCallback(() => setMarkedTrackIds(new Set()), []);
	const toggleMark = useCallback((id: string) => {
		setMarkedTrackIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}, []);

	const clearResults = () => {
		setStep('search');
		setMmQuery(null);
		clearMarks();
	};

	const loadMbids = () => {
		const mbids = artists.map((a) => a.mbid).filter(Boolean);
		setMmQuery({ mbids, tempo, epsilon });
		setStep('results');
	};

	return (
		<div className="flex flex-col gap-4">
			{step === 'search' && (
				<ArtistSearch
					add={add}
					artists={artists}
					epsilon={epsilon}
					isFull={isFull()}
			remove={remove}
					setEpsilon={setEpsilon}
					setTempo={setTempo}
					tempo={tempo}
				/>
			)}
			{step !== 'export' && (
				<SearchControls
					artistCount={mmQuery?.mbids.length ?? 0}
					artists={artists}
					epsilon={epsilon}
					error={error}
					loading={loading}
					onClear={clearResults}
					onFind={loadMbids}
					streaming={streaming}
					tempo={tempo}
				/>
			)}
			{step === 'results' && tracks && (
				<ResultsStep
					markedTrackIds={markedTrackIds}
					onNext={() => setStep('export')}
					toggleMark={toggleMark}
					tracks={tracks}
				/>
			)}
			{step === 'export' && (
				<SpotifyExportPanel
					clearMarks={clearMarks}
					markedTrackIds={markedTrackIds}
					onBack={() => setStep('results')}
					tracks={tracks!}
				/>
			)}
		</div>
	);
}
