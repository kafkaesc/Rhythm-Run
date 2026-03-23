import Link from 'next/link';
import DarkModeToggle from '@/components/DarkModeToggle';
import NavList from '@/components/navigation/NavList';

/** Top-level navigation bar with the site logo, nav links, and dark mode toggle */
export default function Navbar() {
	return (
		<nav className="flex items-center justify-between py-2">
			<Link className="text-4xl font-bold" href="/">
				Rhythm Run
			</Link>
			<div className="flex items-center gap-4">
				<NavList />
				<DarkModeToggle />
			</div>
		</nav>
	);
}
