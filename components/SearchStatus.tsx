import P from '@/components/elements/P';

type SearchStatusProps = {
	err: string | boolean | null;
	errMessage: string;
	loading: boolean | null;
};

/** Displays loading or error status for a search component, holds space if neither are present
 * @param err - Truthy value representing the presence of an error, currently only displays the custom errMessage
 * @param errMessage - Custom error string to display
 * @param loading - True if the search is currently loading
 */
export default function SearchStatus({
	err,
	errMessage,
	loading,
}: SearchStatusProps) {
	const hasDisplay = loading || err;
	return (
		<P className="px-2 text-sm">
			{err && errMessage}
			{loading && 'Loading...'}
			{!hasDisplay && '\u00A0'}
		</P>
	);
}
