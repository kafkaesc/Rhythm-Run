import Link from 'next/link';
import Drawer from '@/components/layout/Drawer';
import NavList from '@/components/navigation/NavList';
import DarkModeToggle from '@/components/DarkModeToggle';

/** Top-level navigation bar with the site logo, nav links, and dark mode toggle */
export default function Navbar() {
	return (
		<nav className="flex items-center py-2 sm:justify-between">
			<div className="flex-1 flex items-center sm:hidden">
				<Drawer title="Rhythm Run" headerRight={<DarkModeToggle />}>
					Hello world, new navigation items coming soon
				</Drawer>
			</div>
			<Link className="text-3xl md:text-4xl font-bold" href="/">
				Rhythm Run
			</Link>
			<div className="flex-1 flex items-center justify-end gap-4">
				<NavList />
				<div className="hidden sm:block">
					<DarkModeToggle />
				</div>
			</div>
		</nav>
	);
}
