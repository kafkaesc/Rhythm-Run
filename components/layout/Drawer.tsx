'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import CloseIcon from '@/components/icons/CloseIcon';
import MenuIcon from '@/components/icons/MenuIcon';
import { cn } from '@/lib/css-utils';

type DrawerProps = Readonly<{
	children?: ReactNode;
	className?: string;
	headerRight?: ReactNode;
	side?: 'left' | 'right';
	title?: ReactNode;
}>;

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
	const panelRef = useRef<HTMLDivElement>(null);

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

	// Mark all DOM siblings of the panel's ancestors as inert so keyboard
	// tab focus cannot use content behind the drawer while it is open.
	// This effect must stay after the focus effect so its cleanup runs first,
	// ensuring inert is removed before focus returns to the trigger button.
	useEffect(() => {
		if (!open || !panelRef.current) return;

		const affected: HTMLElement[] = [];
		let el: HTMLElement | null = panelRef.current;

		// Go up from the panel to document.body, mark every sibling at
		// each level as inert. This blocks keyboard focus on all page
		// content outside the drawer.
		while (el && el !== document.body) {
			const parent: HTMLElement | null = el.parentElement;
			if (parent) {
				Array.from(parent.children).forEach((child) => {
					if (child !== el && !child.hasAttribute('inert')) {
						(child as HTMLElement).setAttribute('inert', '');
						affected.push(child as HTMLElement);
					}
				});
			}
			el = parent;
		}

		return () => affected.forEach((el) => el.removeAttribute('inert'));
	}, [open]);

	/**
	 * Return the panel slide transform:
	 *
	 * - open => in view
	 * - closed + left-anchored => off-screen left
	 * - closed + right-anchored => off-screen right
	 */
	function getPanelTransform() {
		if (open) return 'translate-x-0';
		if (isLeft) return '-translate-x-full';

		return 'translate-x-full';
	}

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
				aria-expanded={open}
				aria-label={open ? 'Close menu' : 'Open menu'}
				className={cn(
					'flex items-center justify-center p-2 rounded-md transition-colors cursor-pointer hover:bg-background-hover border border-transparent',
					className,
				)}
				onClick={() => setOpen(!open)}
				ref={triggerRef}
				type="button"
			>
				<MenuIcon fontSize="1.25rem" />
			</button>
			<div
				className={[
					'fixed top-0 h-full w-[80dvw] max-w-[360px] z-50',
					isLeft ? 'left-0' : 'right-0',
					'transition-transform duration-300 ease-in-out',
					getPanelTransform(),
				].join(' ')}
				inert={!open || undefined}
				ref={panelRef}
			>
				<div className="dark flex flex-col h-full bg-black text-light">
					<div className="flex items-center py-2 px-2 md:px-4">
						<button
							aria-label="Close menu"
							className="flex items-center justify-center p-2 rounded-md transition-colors cursor-pointer hover:bg-dark-hover border border-transparent"
							onClick={() => setOpen(false)}
							ref={closeRef}
							type="button"
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
