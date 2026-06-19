'use client';

import NavItem from '@/components/navigation/NavItem';
import { useSessionStatus } from '@/hooks/useSessionStatus';

type AuthNavItemProps = Readonly<{
	inDrawer?: boolean;
}>;

/** Renders a Login or Profile nav link depending on session state */
export default function AuthNavItem({ inDrawer = false }: AuthNavItemProps) {
	const { hasSession } = useSessionStatus();

	if (hasSession()) return <NavItem href="/profile" inDrawer={inDrawer}>Profile</NavItem>;

	return <NavItem href="/login" inDrawer={inDrawer}>Login</NavItem>;
}
