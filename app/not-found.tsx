import type { Metadata } from 'next';
import Image from 'next/image';
import A from '@/components/elements/A';
import H1 from '@/components/elements/H1';
import P from '@/components/elements/P';

export const metadata: Metadata = {
	title: 'Page not found | Rhythm Run',
};

export default function NotFound() {
	return (
		<main>
			<H1 className="text-center">Little trouble there</H1>
			<P className="text-center">
				The page you were looking for doesn&apos;t exist.
			</P>
			<div className="flex justify-center sm:my-4">
				<Image
					alt="Terence Fletcher, the abusive music teacher from the film Whiplash, makes a frustrated expression while pinching his index and thumb fingers together and pointing them at a student he is about to yell at."
					className="sm:max-w-sm"
					height={892}
					priority
					src="/404.png"
					width={1296}
				/>
			</div>
			<P className="text-center">
				Not quite my tempo. Let&apos;s pick it up at the home page.
			</P>
			<P className="text-center">
				<A href="/">Go home</A>
			</P>
		</main>
	);
}
