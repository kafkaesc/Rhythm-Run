import H1 from '@/components/elements/H1';
import P from '@/components/elements/P';
import BpmSelector from '@/components/BpmSelector';
import GsbDebug from '@/components/Gsb.debug';
import SearchAndAddArtist from '@/components/SearchAndAddArtist';
import SearchAndAddTrack from '@/components/SearchAndAddTrack';

export default function Home() {
	return (
		<main>
			<H1 className="text-center">Rhythm Run</H1>
			<P className="text-center">Find tracks and run at your rate</P>
			<GsbDebug />
			<BpmSelector />
			<div className="flex flex-col gap-4 md:flex-row">
				<div className="flex-1 min-w-0">
					<SearchAndAddTrack title="Search and Add Tracks" />
				</div>
				<div className="flex-1 min-w-0">
					<SearchAndAddArtist title="Search and Add Artists" />
				</div>
			</div>
		</main>
	);
}
