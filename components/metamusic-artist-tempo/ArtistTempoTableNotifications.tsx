import CircleQuestionMarkIcon from '@/components/icons/CircleQuestionMark';

/**
 * Joins artist names into a human-readable list separated by commas and "or",
 * e.g., "Rihanna, Rilo Kiley, or Shakira"
 */
const formatArtists = (artists: string[]): string => {
	if (artists.length === 1) return artists[0];

	if (artists.length === 2) return `${artists[0]} or ${artists[1]}`;

	return `${artists.slice(0, -1).join(', ')}, or ${artists.at(-1)}`;
};

type ArtistTempoTableNotificationsProps = Readonly<{
	noDataArtists?: string[];
}>;

/**
 * Displays a notice listing searched artists that have no tempo data,
 * holds space if none are present
 *
 * @param noDataArtists - Optional, names of searched artists that have no matching tempo data
 */
export default function ArtistTempoTableNotifications({
	noDataArtists,
}: ArtistTempoTableNotificationsProps) {
	const hasDisplay = noDataArtists && noDataArtists.length > 0;

	const noTempoDataDisplay = hasDisplay ? (
		<div className="flex items-center gap-1">
			<span title="This might not be an error, this can happen if there is track data but no matching tempo data.">
				<CircleQuestionMarkIcon />
			</span>
			<span>No tempo data found for {formatArtists(noDataArtists)}</span>
		</div>
	) : null;

	return (
		<div className="text-sm" aria-live="polite">
			{noTempoDataDisplay ?? '\u00A0'}
		</div>
	);
}
