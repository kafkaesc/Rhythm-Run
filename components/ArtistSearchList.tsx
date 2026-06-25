import Button from '@/components/elements/Button';
import AddIcon from '@/components/icons/AddIcon';
import RemoveIcon from '@/components/icons/RemoveIcon';
import Scrollable from '@/components/layout/Scrollable';
import { normalizeLfmArtist } from '@/lib/normalize';
import { LfmArtist } from '@/models/lastFm';

type ArtistRowProps = Readonly<{
	artist: LfmArtist;
	onAdd?: () => void;
	onRemove?: () => void;
}>;

/**
 * A single row in the ArtistSearchList, with optional add or remove buttons
 *
 * @param artist - The {@link LfmArtist} to display
 * @param onAdd - If provided, renders an add button with this function
 * @param onRemove - If provided, renders a remove button with this function
 */
function ArtistRow({ artist, onAdd, onRemove }: ArtistRowProps) {
	const { name } = normalizeLfmArtist(artist);
	return (
		<div>
			<div className="flex items-center gap-2 py-1">
				{onRemove && (
					<Button
						aria-label={`Remove ${name}`}
						buttonStyle="danger"
						className="p-0"
						mini
						onClick={onRemove}
						type="button"
					>
						<RemoveIcon height={16} width={16} />
					</Button>
				)}
				{onAdd && (
					<Button
						aria-label={`Add ${name}`}
						buttonStyle="black-white"
						className="p-0"
						mini
						onClick={onAdd}
						type="button"
					>
						<AddIcon height={16} width={16} />
					</Button>
				)}
				<span>{name}</span>
			</div>
			<hr aria-hidden="true" />
		</div>
	);
}

type ArtistSearchListProps = Readonly<{
	add?: (artist: LfmArtist) => void;
	remove?: (artist: LfmArtist) => void;
	results: LfmArtist[] | null;
	selected: LfmArtist[];
}>;

/**
 * Displays a unified, scrollable list of Last.fm artists for the artist
 * search step. Selected artists appear at the top with a remove button and
 * are excluded from results. When present, search results are displayed
 * beneath selected artists with an add button.
 *
 * @param add - Callback function to add an artist from the search results
 * @param remove - Callback to remove a selected artist
 * @param results - Nullable LfmArtists[] returned by the search with selected artists are filtered out
 * @param selected - LfmArtists[] already selected, shown at the top of the list
 */
export default function ArtistSearchList({
	add,
	remove,
	results,
	selected,
}: ArtistSearchListProps) {
	const selectedKeys = new Set(selected.map((se) => se.mbid || se.name));
	const filteredResults =
		results?.filter((re) => !selectedKeys.has(re.mbid || re.name)) ?? [];

	if (selected.length === 0 && filteredResults.length === 0) return <></>;

	return (
		<Scrollable maxHeight="11em">
			<hr aria-hidden="true" />
			{selected.map((ar) => (
				<ArtistRow
					artist={ar}
					key={ar.mbid || ar.name}
					onRemove={remove ? () => remove(ar) : undefined}
				/>
			))}
			{filteredResults.map((ar) => (
				<ArtistRow
					artist={ar}
					key={ar.mbid || ar.name}
					onAdd={add ? () => add(ar) : undefined}
				/>
			))}
		</Scrollable>
	);
}
