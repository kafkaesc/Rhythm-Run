'use client';

import { useCallback } from 'react';

const TABBABLE_SELECTOR = [
	'a[href]:not([tabindex="-1"])',
	'button:not([disabled]):not([tabindex="-1"])',
	'input:not([disabled]):not([tabindex="-1"])',
	'select:not([disabled]):not([tabindex="-1"])',
	'textarea:not([disabled]):not([tabindex="-1"])',
	'[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Returns a stable function that queries all currently visible, tabbable elements in the DOM.
 * Useful as a building block for focus management when a focused element is removed.
 */
export function useScrollableElements() {
	const getTabbableElements = useCallback((): HTMLElement[] => {
		return Array.from(
			document.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR),
		).filter((el) => el.offsetParent !== null);
	}, []);

	return { getTabbableElements };
}
