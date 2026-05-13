import P from '@/components/elements/P';
import { ReactNode } from 'react';

type SearchStatusProps = {
	err: string | boolean | null;
	errMessage?: ReactNode;
	id?: string;
	loading: boolean | null;
	loadingMessage?: ReactNode;
	streaming?: boolean;
	streamingMessage?: ReactNode;
};

/**
 * Displays loading, streaming, or error status for a search component, holds space if none are present
 *
 * @param err - Truthy value representing the presence of an error
 * @param errMessage - Optional message to display on error, defaults to "Error"
 * @param id - Applied to the root element, use with aria-describedby on the associated input
 * @param loading - True if the search is currently loading
 * @param loadingMessage - Optional message to display while loading, default is "Loading..."
 * @param streaming - Optional, true if results are currently being streamed
 * @param streamingMessage - Optional message to display while streaming, default is "Loading..."
 */
export default function SearchStatus({
	err,
	errMessage = 'Error',
	id,
	loading,
	loadingMessage = 'Loading...',
	streaming,
	streamingMessage = 'Loading...',
}: SearchStatusProps) {
	const hasDisplay = loading || streaming || err;
	return (
		<P aria-live="polite" className="px-2 text-sm" id={id}>
			{err && errMessage}
			{loading && loadingMessage}
			{streaming && streamingMessage}
			{!hasDisplay && '\u00A0'}
		</P>
	);
}
