'use client';

import { ReactNode, useState } from 'react';
import MenuIcon from '@/components/icons/MenuIcon';
import { cn } from '@/lib/css-utils';

type DrawerProps = {
	children?: ReactNode;
	className: string;
	side?: 'left' | 'right';
};

export default function Drawer({
	children,
	className,
	side = 'left',
}: DrawerProps) {
	const [open, setOpen] = useState(false);
	const isLeft = side !== 'right';

	return (
		<>
			{open && (
				<div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
			)}
			<button
				onClick={() => setOpen(!open)}
				className={cn('flex items-center justify-center px-3 py-1 rounded-md transition-colors cursor-pointer hover:bg-background-hover border border-dark dark:border-light', className)}
			>
				<MenuIcon fontSize="1.25rem" />
			</button>
			<div
				className={[
					'fixed top-0 h-full w-[80dvw] max-w-[400px] z-50',
					isLeft ? 'left-0' : 'right-0',
					'transition-transform duration-300 ease-in-out',
					open
						? 'translate-x-0'
						: isLeft
							? '-translate-x-full'
							: 'translate-x-full',
				].join(' ')}
			>
				<div className="h-full bg-dark dark:bg-black text-light">
					{children}
				</div>
			</div>
		</>
	);
}
