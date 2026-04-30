import A from '@/components/elements/A';
import H1 from '@/components/elements/H1';
import H2 from '@/components/elements/H2';
import P from '@/components/elements/P';

export default function AboutPage() {
	return (
		<main>
			<H1 className="text-center">About</H1>
			<P>A page About Rhythm Run, lorem ipsum dolor sic</P>
			<H2>Social Links</H2>
			<nav aria-label="Social media links">
				<ul className="flex gap-4">
					<li>
						<A href="https://github.com/kafkaesc">GitHub</A>
					</li>
					<li>
						<A href="https://instagram.com/kafkaesc">Instagram</A>
					</li>
					<li>
						<A href="https://twitter.com/kafkaesc">X/Twitter</A>
					</li>
				</ul>
			</nav>
		</main>
	);
}
