import P from '@/components/elements/P';

type SearchStatusProps = {
	err: string | boolean | null;
	errMessage: string;
	id?: string;
	loading: boolean | null;
};

/**
 * Displays loading or error status for a search component, holds space if neither are present
 *
 * @param err - Truthy value representing the presence of an error, currently only displays the custom errMessage
 * @param errMessage - Custom error string to display
 * @param id - Applied to the root element, use with aria-describedby on the associated input
 * @param loading - True if the search is currently loading
 */
export default function SearchStatus({
	err,
	errMessage,
	id,
	loading,
}: SearchStatusProps) {
	const hasDisplay = loading || err;
	return (
		<P aria-live="polite" className="px-2 text-sm" id={id}>
			{err && errMessage}
			{loading && 'Loading...'}
			{!hasDisplay && '\u00A0'}
		</P>
	);
}
