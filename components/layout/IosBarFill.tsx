'use client';

import { useDarkMode } from '@/hooks/useDarkMode';

/**
 * Decorative strip that fills the band behind iOS Safari's bottom bar so the
 * bar takes the footer's colour instead of rendering grey. The positioning
 * lives in the .ios-bar-fill rule in app/globals.css, which is gated to iOS.
 *
 * Safari samples that colour once and will not re-sample when styles change,
 * so toggling the theme would otherwise leave the bar on the old colour until
 * a manual refresh. Keying the element on the theme remounts the node, and
 * replacing the node is what does force Safari to sample again.
 */
export default function IosBarFill() {
	const { isDark } = useDarkMode();

	return (
		<div
			aria-hidden="true"
			className="ios-bar-fill bg-dark dark:bg-black"
			key={isDark ? 'dark' : 'light'}
		/>
	);
}
