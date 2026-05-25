'use client';

import NavItem from '@/components/navigation/NavItem';
import { useSessionStatus } from '@/hooks/useSessionStatus';

/** Renders a Login or Profile nav link depending on session state */
export default function AuthNavItem() {
	const { hasSession } = useSessionStatus();

	if (hasSession()) return <NavItem href="/profile">Profile</NavItem>;

	return <NavItem href="/login">Login</NavItem>;
}
