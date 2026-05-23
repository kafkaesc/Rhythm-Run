import P from '@/components/elements/P';
import ClockAlertIcon from '@/components/icons/ClockAlertIcon';
import { LFM_TOP_TRACKS_LIMIT } from '@/lib/lastfm';
import { MS_PER_SECOND, SECONDS_PER_MINUTE } from '@/lib/math';
import { GSB_RATE_LIMIT_MS } from '@/lib/metamusic';

/**
 * Create display text with the worst-case scenario loading time based on
 * artist count, the number of tracks being parsed, and the rate limit for
 * the API calls.
 *
 * @param artistCount - Number of artists being queried
 */
function buildEstimateText(artistCount: number | undefined): string {
	// No artistCount, no estimate text
	if (artistCount === undefined) return '';

	// Build the loading estimate text
	const estimatedSeconds =
		(artistCount * LFM_TOP_TRACKS_LIMIT * GSB_RATE_LIMIT_MS) / MS_PER_SECOND;
	const estimatedMinutes = Math.ceil(estimatedSeconds / SECONDS_PER_MINUTE);
	return ` Estimated wait: up to ${estimatedMinutes} minute${estimatedMinutes !== 1 ? 's' : ''}.`;
}

type ProxyWarningProps = {
	artistCount?: number;
};

/**
 * Displays a warning that a secure proxy is likely buffering the stream.
 * If artistCount is provided it also displays a worst-case scenario
 * load time estimate.
 *
 * @param artistCount - Number of artists being queried, used to estimate loading time
 */
export default function ProxyWarning({ artistCount }: ProxyWarningProps) {
	const estimateText = buildEstimateText(artistCount);

	return (
		<div className="flex items-center gap-3 rounded-md bg-warning px-4 py-3">
			<ClockAlertIcon className="shrink-0 self-center text-dark text-2xl" />
			<P className="grow text-sm text-dark">
				This may take a few minutes &mdash; your network is holding onto results
				until everything is finished. This is common at workplaces that user
				security software like Zscaler, Cisco Umbrella, or Prisma.{estimateText}
			</P>
		</div>
	);
}
