'use client';

import { useEffect } from 'react';
import { useSpotifyTrackSearch } from '@/hooks/useSpotifyApi';

interface TrackSearchProps {
	query: string;
}

export default function TrackSearch({ query }: TrackSearchProps) {
	const { tracks, loading, error } = useSpotifyTrackSearch(query);

	useEffect(() => {
		if (loading) console.log('Loading tracks...');
		if (error) console.error('Error fetching tracks:', error);
		if (tracks) console.log('Fetched tracks:', tracks);
	}, [tracks, loading, error]);

	if (!tracks) return <></>;

	return (
		<>
			<hr />
			{tracks.map((tr) => (
				<div key={tr.id}>
					<p className="py-2">
						&quot;{tr.name}&quot; by{' '}
						{tr.artists.map((ar) => ar.name).join(', ')}
					</p>
					<hr />
				</div>
			))}
		</>
	);
}
