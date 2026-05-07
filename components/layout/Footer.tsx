import H2 from '@/components/elements/H2';
import Container from '@/components/layout/Container';
import JhSocialLinks from '@/components/JhSocialLinks';
import PoweredBy from '@/components/PoweredBy';

export default function Footer() {
	return (
		<footer className="w-full bg-dark py-6 text-light dark:bg-black">
			<Container>
				<div className="grid grid-cols-3 sm:grid-cols-2">
					<H2 className="col-span-2 sm:col-span-1 text-lg sm:text-2xl">
						Built by Jared Hettinger
					</H2>
					<H2 className="text-right text-lg sm:text-2xl">Powered By</H2>
					<div className="col-span-2 sm:col-span-1">
						<JhSocialLinks colorMode="light" />
					</div>
					<PoweredBy />
				</div>
			</Container>
		</footer>
	);
}
