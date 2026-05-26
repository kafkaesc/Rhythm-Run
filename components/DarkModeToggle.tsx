'use client';

import { useState } from 'react';
import DarkModeIcon from '@/components/icons/DarkModeIcon';
import LightModeIcon from '@/components/icons/LightModeIcon';
import { useDarkMode } from '@/hooks/useDarkMode';

const buttonBaseStyles =
	'px-4 py-1 text-sm text-center transition-colors cursor-pointer hover:bg-background-hover focus-visible:bg-background-hover focus-visible:outline-none';

/**
 * Toggle button for switching the site between light and dark mode.
 * Persists the user's preference and animates an indicator on change.
 */
export default function DarkModeToggle() {
	const { isDark, toggle } = useDarkMode();
	// Only enable the indicator animation once the user has triggered a toggle,
	// to avoid animating on initial load when the script sets the theme class
	const [hasToggled, setHasToggled] = useState(false);

	function handleToggle() {
		setHasToggled(true);
		toggle();
	}

	return (
		<div className="relative inline-grid grid-cols-2 rounded-full border border-foreground overflow-hidden">
			<button
				aria-label="Toggle light mode"
				aria-pressed={!isDark}
				className={buttonBaseStyles}
				onClick={() => isDark && handleToggle()}
				type="button"
			>
				<LightModeIcon className="text-2xl" />
			</button>
			<button
				aria-label="Toggle dark mode"
				aria-pressed={isDark}
				className={buttonBaseStyles}
				onClick={() => !isDark && handleToggle()}
				type="button"
			>
				<DarkModeIcon className="text-2xl" />
			</button>
			<span
				className={`absolute bottom-0.5 h-0.5 w-[calc(50%-1.6rem)] bg-highlight ${hasToggled ? 'transition-[left] duration-300' : ''} ${isDark ? 'left-[calc(50%+0.7rem)]' : 'left-3'}`}
			/>
		</div>
	);
}
