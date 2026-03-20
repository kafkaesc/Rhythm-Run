'use client';

import { useSyncExternalStore } from 'react';

// If this key is changed you need to update the script in app/layout.tsx as well
const KEY = 'tr-theme';

// Subscribe to changes in the theme by listening to the custom 'theme-change' event
function subscribe(callback: () => void) {
	window.addEventListener('theme-change', callback);
	return () => window.removeEventListener('theme-change', callback);
}

/**
 * Subscribes to the current dark mode state and provides a toggle function.
 * @returns An object containing:
 * - `isDark` (whether dark mode is active)
 * - `toggle` (a function to switch between light and dark mode)
 */
export function useDarkMode() {
	// useSyncExternalStore handles SSR/hydration correctly: server uses getServerSnapshot,
	// client uses getSnapshot (which reads the class already set by the inline script)
	const isDark = useSyncExternalStore(
		subscribe,
		// Read the actual DOM state set by the inline script in app/layout.tsx
		() => document.documentElement.classList.contains('dark'),
		// The value on the server is always false because it does not store the theme
		() => false,
	);

	// Toggle between light and dark mode
	function toggle() {
		const next = !isDark;
		document.documentElement.classList.toggle('dark', next);
		localStorage.setItem(KEY, next ? 'dark' : 'light');
		window.dispatchEvent(new Event('theme-change'));
	}

	return { isDark, toggle };
}
