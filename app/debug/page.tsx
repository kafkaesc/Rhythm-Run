import SpotifyLoginButton from '@/components/auth/SpotifyLoginButton';
import H1 from '@/components/elements/H1';
import SpotifyArtistSearch from '@/components/SpotifyArtistSearch';

export default function DebugPage() {
	return (
		<>
			<H1 className="text-center">Debug 🪲</H1>
			<div className="flex justify-center">
				<SpotifyLoginButton />
			</div>
			<SpotifyArtistSearch />
		</>
	);
}
