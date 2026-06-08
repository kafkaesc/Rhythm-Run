'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/elements/Button';
import ArtistTempoQueryDisplay from '@/components/metamusic-artist-tempo/ArtistTempoQueryDisplay';
import LoadingMessages from '@/components/metamusic-artist-tempo/LoadingMessages';
import ProxyWarning from '@/components/metamusic-artist-tempo/ProxyWarning';
import SearchStatus from '@/components/SearchStatus';
import { LfmArtist } from '@/models/lastFm';

type SearchControlsProps = {
	artistCount: number;
	artists: LfmArtist[];
	epsilon: number;
	error: string | null;
	loading: boolean;
	onClear: () => void;
	onFind: () => void;
	streaming: boolean;
	tempo: number;
};

export default function SearchControls({
	artistCount,
	artists,
	epsilon,
	error,
	loading,
	onClear,
	onFind,
	streaming,
	tempo,
}: SearchControlsProps) {
	const [slowLoad, setSlowLoad] = useState(false);

	useEffect(() => {
		if (!loading) return;
		const timer = setTimeout(() => setSlowLoad(true), 20_000);
		return () => {
			clearTimeout(timer);
			setSlowLoad(false);
		};
	}, [loading]);

	const disabled = artists.length === 0;
	const showProxyWarning = slowLoad && loading;
	return (
		<div className="flex flex-col items-center gap-2">
			<div>
				<ArtistTempoQueryDisplay
					artists={artists}
					epsilon={epsilon}
					tempo={tempo}
				/>
			</div>
			<div className="flex gap-3">
				<Button
					buttonStyle="primary"
					disabled={disabled}
					onClick={onFind}
					type="button"
				>
					Find Tracks
				</Button>
				<Button buttonStyle="black-white" onClick={onClear} type="button">
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
			{showProxyWarning && <ProxyWarning artistCount={artistCount} />}
		</div>
	);
}
