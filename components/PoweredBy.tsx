import A from '@/components/elements/A';
import FlatteningList from '@/components/FlatteningList';

const powerSources = [
	{ href: 'https://www.getsongbpm.com/api', name: 'GetSongBPM' },
	{ href: 'https://www.last.fm/api', name: 'Last.fm' },
];

export default function PoweredBy() {
	return (
		<FlatteningList
			className="items-end sm:justify-end"
			list={powerSources.map((power) => ({
				key: power.name,
				node: (
					<A
						href={power.href}
						className="text-light hover:bg-dark-hover focus-visible:bg-dark-hover"
					>
						{power.name}
					</A>
				),
			}))}
			separator="//"
		/>
	);
}
