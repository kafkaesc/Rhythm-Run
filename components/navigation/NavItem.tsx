'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/css-utils';

type NavItemProps = {
	children: React.ReactNode;
	href: string;
};

/**
 * A navigation list item that highlights itself when its href matches the current path.
 * Internal links use Next Link for client-side navigation; external links open in a new tab.
 * @param href - The URL to navigate to
 * @param children - The link text or element
 */
export default function NavItem({ children, href }: NavItemProps) {
	// Determine if the current path matches the href to apply active CSS
	const pathname = usePathname();
	const isActive = pathname === href;

	const liStyles = cn(
		'px-3 py-1 rounded-md transition-colors cursor-pointer',
		isActive ? 'bg-foreground text-background' : 'hover:bg-background-hover',
	);

	const linkStyles = 'no-underline text-inherit';

	// Internal links use Next Link for client-side navigation
	if (href.startsWith('/') || href.startsWith('#')) {
		return (
			<li className={liStyles}>
				<Link className={linkStyles} href={href}>
					{children}
				</Link>
			</li>
		);
	}

	// External links use an anchor element and open in a new tab
	return (
		<li className={liStyles}>
			<a
				className={linkStyles}
				href={href}
				rel="noopener noreferrer"
				target="_blank"
			>
				{children}
			</a>
		</li>
	);
}
