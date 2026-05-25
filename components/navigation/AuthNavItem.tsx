'use client';

import { useSession } from 'next-auth/react';
import NavItem from '@/components/navigation/NavItem';

/** Renders a Login or Profile nav link depending on session state */
export default function AuthNavItem() {
	const { data: session } = useSession();

	if (session) return <NavItem href="/profile">Profile</NavItem>;

	return <NavItem href="/login">Login</NavItem>;
}
