import H1 from '@/components/elements/H1';
import H2 from '@/components/elements/H2';
import P from '@/components/elements/P';
// import BpmSelector from '@/components/BpmSelector';
import SearchAndAddArtist from '@/components/SearchAndAddArtist';
import SearchAndAddTrack from '@/components/SearchAndAddTrack';
import GsbTrackSearch from '@/components/GsbTrackSearch';
import GsbArtistSearch from '@/components/GsbArtistSearch';
import MbArtistSearch from '@/components/MbArtistSearch';
import MbTrackSearch from '@/components/MbTrackSearch';

export default function Home() {
	return (
		<main>
			<H1 className="text-center">Rhythm Run</H1>
			<P className="text-center">Find tracks and run at your rate</P>
			<div className="flex flex-col gap-4 md:flex-row">
				<div className="flex-1 min-w-0">
					<H2>MusicBrainz Track Search</H2>
					<MbTrackSearch />
				</div>
				<div className="flex-1 min-w-0">
					<H2>MusicBrainz Artist Search</H2>
					<MbArtistSearch />
				</div>
			</div>
			<div className="flex flex-col gap-4 md:flex-row">
				<div className="flex-1 min-w-0">
					<H2>GetSongBPM Track Search</H2>
					<GsbTrackSearch />
				</div>
				<div className="flex-1 min-w-0">
					<H2>GetSongBPM Artist Search</H2>
					<GsbArtistSearch />
				</div>
			</div>
			{/* <BpmSelector /> */}
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
