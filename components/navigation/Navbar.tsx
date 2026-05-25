import Link from 'next/link';
import Drawer from '@/components/layout/Drawer';
import NavList from '@/components/navigation/NavList';
import DarkModeToggle from '@/components/DarkModeToggle';

/** Top-level navigation bar with the site logo, nav links, and dark mode toggle */
export default function Navbar() {
	return (
		<nav className="flex flex-col py-2 sm:flex-row sm:items-center sm:justify-between">
			<Link className="text-4xl font-bold text-center sm:text-left" href="/">
				Rhythm Run
			</Link>
			<div className="flex items-center justify-between sm:justify-normal sm:gap-4">
				<Drawer className="sm:hidden">Hello world</Drawer>
				<NavList />
				<DarkModeToggle />
			</div>
		</nav>
	);
}
