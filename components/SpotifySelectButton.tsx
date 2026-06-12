'use client';

import SpotifyIcon from '@/components/icons/SpotifyIcon';
import { cn } from '@/lib/css-utils';

type SpotifySelectButtonProps = {
	marked: boolean;
	onClick: () => void;
	title: string;
};

/**
 * Toggle button used to mark a track for Spotify export.
 * Unselected: green border, green icon.
 * Selected: green border, green fill rising from the bottom over 1.2 seconds, white icon.
 *
 * @param marked - whether the track is currently marked
 * @param onClick - callback to toggle the marked state
 * @param title - track title, used in the accessible aria-label
 */
export default function SpotifySelectButton({
	marked,
	onClick,
	title,
}: SpotifySelectButtonProps) {
	return (
		<button
			aria-label={`${marked ? 'Remove' : 'Add'} ${title} ${marked ? 'from' : 'to'} Spotify`}
			aria-pressed={marked}
			className="relative overflow-hidden p-1 rounded-md border-2 border-spotify cursor-pointer"
			onClick={onClick}
			type="button"
		>
			{/* Green fill that rises from the bottom when marked */}
			<span
				className={cn(
					'absolute bottom-0 left-0 w-full bg-spotify',
					'transition-[height] duration-[1200ms] ease-in-out',
					marked ? 'h-full' : 'h-0',
				)}
			/>
			<SpotifyIcon
				aria-hidden="true"
				className={cn(
					'relative z-10 h-4 w-4',
					marked ? 'text-white' : 'text-spotify',
				)}
			/>
		</button>
	);
}
