import NavItem from '@/components/navigation/NavItem';

/** The site navigation list */
export default function NavList() {
	return (
		<ul className="flex gap-2">
			<NavItem href="/">Home</NavItem>
			<NavItem href="/about">About</NavItem>
		</ul>
	);
}
