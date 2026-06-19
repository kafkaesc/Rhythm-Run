'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/elements/Button';
import LoadingMessages from '@/components/metamusic-artist-tempo/LoadingMessages';
import ProxyWarning from '@/components/metamusic-artist-tempo/ProxyWarning';
import SearchStatus from '@/components/SearchStatus';

type SearchControlsProps = Readonly<{
	artistCount: number;
	disabled: boolean;
	error: string | null;
	loading: boolean;
	onClear: () => void;
	onFind: () => void;
	streaming: boolean;
}>;

/**
 * Renders the Find Tracks and Clear Results buttons along with
 * loading and error status. Displays a proxy warning if the
 * load takes longer than 30 seconds.
 *
 * @param artistCount - Number of artists being searched, used to estimate load time
 * @param disabled - Disables the Find Tracks button when no artists are selected
 * @param error - Error message or null
 * @param loading - True while the search request is in flight
 * @param onClear - Called when the user clicks Clear Results
 * @param onFind - Called when the user clicks Find Tracks
 * @param streaming - True while results are streaming
 */
export default function SearchControls({
	artistCount,
	disabled,
	error,
	loading,
	onClear,
	onFind,
	streaming,
}: SearchControlsProps) {
	const [slowLoad, setSlowLoad] = useState(false);

	useEffect(() => {
		if (!loading) return;
		const timer = setTimeout(() => setSlowLoad(true), 30_000);
		return () => {
			clearTimeout(timer);
			setSlowLoad(false);
		};
	}, [loading]);

	const showProxyWarning = slowLoad && loading;

	return (
		<div className="flex flex-col items-center gap-2">
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
