import H1 from '@/components/elements/H1';
import P from '@/components/elements/P';
import MetaMusicArtistTempo from '@/components/MetaMusicArtistTempo';

export default function Home() {
	return (
		<main>
			<H1 className="text-center">Rhythm Run</H1>
			<P className="text-center">Find tracks and run at your rate</P>
			<div>
				<MetaMusicArtistTempo />
			</div>
		</main>
	);
}
