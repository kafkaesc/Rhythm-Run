import AuthNavItem from '@/components/navigation/AuthNavItem';
import NavItem from '@/components/navigation/NavItem';
import { cn } from '@/lib/css-utils';
import { SITE_MAP } from '@/lib/constants';

type NavListProps = {
	className?: string;
	inDrawer?: boolean;
	stacked?: boolean;
};

/** The site navigation list */
export default function NavList({ className, inDrawer = false, stacked = false }: NavListProps) {
	return (
		<ul className={cn(stacked ? 'flex flex-col gap-1' : 'flex gap-2', className)}>
			{Object.values(SITE_MAP)
				.filter(({ display }) => display)
				.map(({ href, name }) => (
					<NavItem key={href} href={href} inDrawer={inDrawer}>
						{name}
					</NavItem>
				))}
			<AuthNavItem inDrawer={inDrawer} />
		</ul>
	);
}
