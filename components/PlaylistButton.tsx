'use client';

import Image from 'next/image';
import { cn } from '@/lib/css-utils';
import { SpotifyPlaylist } from '@/models/spotify';

const baseStyle =
	'flex items-center gap-3 w-full rounded-md px-3 py-2 cursor-pointer transition-colors hover:bg-background-hover';

type PlaylistButtonProps = React.ComponentPropsWithoutRef<'button'> & {
	href?: string;
	playlist: SpotifyPlaylist;
};

/**
 * Renders a Spotify playlist with its cover art and name.
 * When href is provided, renders as an external anchor link.
 * When onClick is provided, renders as a button that calls the callback.
 *
 * @param href - Optional, if provided renders as an anchor linking to this URL
 * @param playlist - The {@link SpotifyPlaylist} to display
 */
export default function PlaylistButton({
	className,
	href,
	playlist,
	...props
}: PlaylistButtonProps) {
	const image =
		playlist.images[playlist.images.length - 2] ??
		playlist.images[playlist.images.length - 1];

	// Anchor/Button content
	const child = (
		<>
			{image && (
				<Image
					alt={`${playlist.name} cover`}
					className="h-20 w-20 shrink-0"
					height={80}
					src={image.url}
					width={80}
				/>
			)}
			<span
				className={
					href ? 'underline decoration-highlight decoration-[0.1em]' : undefined
				}
			>
				{playlist.name}
			</span>
		</>
	);

	// Anchor element return
	if (href) {
		return (
			<a
				className={cn(baseStyle, className)}
				href={href}
				rel="noopener noreferrer"
				target="_blank"
			>
				{child}
			</a>
		);
	}

	// Button element return
	return (
		<button
			className={cn(
				baseStyle,
				'disabled:opacity-40 disabled:cursor-not-allowed',
				className,
			)}
			{...props}
		>
			{child}
		</button>
	);
}
