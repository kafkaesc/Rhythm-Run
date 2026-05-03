import P from './elements/P';
import { MbArtist } from '@/models/musicBrainz';

type ArtistTempoQueryDisplayProps = {
	artists?: MbArtist[];
	epsilon?: number | string;
	tempo?: number | string;
};

export default function ArtistTempoQueryDisplay({
	tempo,
	artists,
	epsilon,
}: ArtistTempoQueryDisplayProps) {
	const a = artists?.length ? artists.map((ar) => ar.name).join(', ') : '____';
	const e = epsilon ? `, give or take ${epsilon} bpm,` : '';
	const t = tempo ? tempo : '____';

	return (
		<P>
			I want tracks at a {t} tempo{e} from {a}
		</P>
	);
}
