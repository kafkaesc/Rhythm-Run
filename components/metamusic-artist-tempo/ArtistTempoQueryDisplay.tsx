import P from '@/components/elements/P';
import { LfmArtist } from '@/models/lastFm';
import { MbArtist } from '@/models/musicBrainz';

type ArtistTempoQueryDisplayProps = Readonly<{
	artists?: LfmArtist[] | MbArtist[];
	epsilon?: number | string;
	tempo?: number | string;
}>;

/**
 * Displays a natural-language summary of the current search query
 *
 * @param artists - Optional, list of selected artists
 * @param epsilon - Optional, BPM tolerance range, i.e., search for a tempo ±epsilon
 * @param tempo - Optional, target BPM
 */
export default function ArtistTempoQueryDisplay({
	tempo,
	artists,
	epsilon,
}: ArtistTempoQueryDisplayProps) {
	const a = artists?.length ? artists.map((ar) => ar.name).join(', ') : '____';
	const e = epsilon ? `, give or take ${epsilon} bpm,` : '';
	const t = tempo || '____';

	return (
		<P>
			I want tracks at a {t} bpm{e} from {a}
		</P>
	);
}
