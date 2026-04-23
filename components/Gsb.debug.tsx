'use client';

import { useState } from 'react';
import Button from '@/components/elements/Button';
import P from '@/components/elements/P';
import TrackList from '@/components/TrackList';
import { useGsbSongSearch } from '@/hooks/useGetSongBpmApi';
import { NormalizeGsbTrack } from '@/lib/normalize';

export default function GsbDebug() {
	const [query, setQuery] = useState<null | string>(null);
	const { songs, loading, error } = useGsbSongSearch(query);

	return (
		<div>
			<div className="flex items-center gap-2">
				<Button
					mini
					onClick={() => setQuery("Sugar, We're Goin Down")}
					type="button"
				>
					SWGD
				</Button>
				<Button mini onClick={() => setQuery('Basket Case')} type="button">
					Basket Case
				</Button>
				<Button mini onClick={() => setQuery('Feel Good Inc')} type="button">
					Feel Good Inc.
				</Button>
			</div>
			<P className="px-2 text-sm">
				{error && 'Error with the GetSongBPM response'}
				{loading && 'Loading...'}
				{!error && !loading && ' '}
			</P>
			<TrackList toTrack={NormalizeGsbTrack} tracks={songs} />
		</div>
	);
}
