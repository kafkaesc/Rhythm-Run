import H1 from '@/components/elements/H1';
import H2 from '@/components/elements/H2';
import P from '@/components/elements/P';
import SpotifySearch from '@/components/SpotifySearch';

export default function Home() {
	return (
		<main>
			<H1 className="text-center">Rhythm Run</H1>
			<P className="text-center">Find tracks and run at your rate</P>
			<H2>Search Spotify</H2>
			<SpotifySearch />
		</main>
	);
}
