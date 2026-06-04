'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import CloseIcon from '@/components/icons/CloseIcon';
import MenuIcon from '@/components/icons/MenuIcon';
import { cn } from '@/lib/css-utils';

type DrawerProps = {
	children?: ReactNode;
	className?: string;
	headerRight?: ReactNode;
	side?: 'left' | 'right';
	title?: ReactNode;
};

/**
 * Slide-out panel anchored to the left or right edge of the screen.
 * Initially displays a menu button that opens the drawer on click.
 *
 * @param children - Optional, content rendered inside the drawer panel
 * @param className - Optional, additional classes applied to the menu trigger button
 * @param headerRight - Optional, content rendered in the top-right corner of the drawer header
 * @param side - Optional, default 'left', which edge of the screen the drawer slides out from
 * @param title - Optional, heading text displayed in the drawer header
 */
export default function Drawer({
	children,
	className,
	headerRight,
	side = 'left',
	title,
}: DrawerProps) {
	const [open, setOpen] = useState(false);
	const isLeft = side !== 'right';
	const triggerRef = useRef<HTMLButtonElement>(null);
	const closeRef = useRef<HTMLButtonElement>(null);

	// We need to switch the focus onto the drawer when it opens
	// and then back to the menu button when it closes
	useEffect(() => {
		if (open) closeRef.current?.focus();
		else triggerRef.current?.focus();
	}, [open]);

	// Listen for the esc button to close the drawer
	useEffect(() => {
		if (!open) return;

		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape') setOpen(false);
		}

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [open]);

	return (
		<>
			{open && (
				<div
					aria-hidden="true"
					className="fixed inset-0 z-40"
					onClick={() => setOpen(false)}
				/>
			)}
			<button
				ref={triggerRef}
				aria-expanded={open}
				aria-label={open ? 'Close menu' : 'Open menu'}
				onClick={() => setOpen(!open)}
				type="button"
				className={cn(
					'flex items-center justify-center p-2 rounded-md transition-colors cursor-pointer hover:bg-background-hover border border-transparent',
					className,
				)}
			>
				<MenuIcon fontSize="1.25rem" />
			</button>
			<div
				inert={!open || undefined}
				className={[
					'fixed top-0 h-full w-[80dvw] max-w-[360px] z-50',
					isLeft ? 'left-0' : 'right-0',
					'transition-transform duration-300 ease-in-out',
					open
						? 'translate-x-0'
						: isLeft
							? '-translate-x-full'
							: 'translate-x-full',
				].join(' ')}
			>
				<div className="dark flex flex-col h-full bg-black text-light">
					<div className="flex items-center py-2 px-2 md:px-4">
						<button
							ref={closeRef}
							aria-label="Close menu"
							onClick={() => setOpen(false)}
							type="button"
							className="flex items-center justify-center p-2 rounded-md transition-colors cursor-pointer hover:bg-dark-hover border border-transparent"
						>
							<CloseIcon fontSize="1.25rem" />
						</button>
						{title && <span className="font-bold text-xl ml-2">{title}</span>}
						{headerRight && <div className="ml-auto">{headerRight}</div>}
					</div>
					{children}
				</div>
			</div>
		</>
	);
}
