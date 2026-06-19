'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

type SessionProviderProps = Readonly<{
	children: React.ReactNode;
}>;

/**
 * Wraps the app in NextAuth's SessionProvider so that any client component
 * can access the session via useSessionStatus. This wrapper is necessary because
 * SessionProvider requires 'use client', which cannot be imported directly
 * from a server component like layout.tsx.
 */
export default function SessionProvider({ children }: SessionProviderProps) {
	return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
