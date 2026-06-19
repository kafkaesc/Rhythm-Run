'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/css-utils';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon';

type ScrollableIconProps = Readonly<{
	visible: boolean;
}>;

function ScrollableIcon({ visible }: ScrollableIconProps) {
	return (
		<div
			className={cn(
				'absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-500',
				visible ? 'opacity-100' : 'opacity-0',
			)}
		>
			<div className="animate-float">
				<div className="h-8 rounded-full bg-dark dark:bg-light flex items-center gap-1 px-3">
					<ChevronDownIcon
						className="text-light dark:text-dark"
						height={22}
						width={22}
					/>
					<span className="text-xs text-light dark:text-dark whitespace-nowrap">
						Scroll for more
					</span>
				</div>
			</div>
		</div>
	);
}

type ScrollableProps = React.ComponentPropsWithoutRef<'div'> & {
	height?: React.CSSProperties['height'];
	maxHeight?: React.CSSProperties['maxHeight'];
};

/**
 * A div with vertical scrolling enabled. Accepts dimensions to constrain
 * its size before the scroll kicks in. Displays a floating down chevron as
 * a notice the content can be scrolled. The hint fades upon scroll.
 *
 * @param height - Optional, CSS height value (e.g. '400px', '50dvh')
 * @param maxHeight - Optional, CSS max-height value
 */
export default function Scrollable({
	children,
	className,
	height,
	maxHeight,
	onScroll,
	style,
	...props
}: ScrollableProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [overflows, setOverflows] = useState(false);
	const [hasScrolled, setHasScrolled] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new ResizeObserver(() => {
			setOverflows(el.scrollHeight > el.clientHeight);
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	function handleScroll(e: React.UIEvent<HTMLDivElement>) {
		if (!hasScrolled) setHasScrolled(true);
		onScroll?.(e);
	}

	return (
		<div
			className={cn('overflow-y-auto relative', className)}
			onScroll={handleScroll}
			ref={ref}
			style={{ height, maxHeight, ...style }}
			{...props}
		>
			{children}
			<ScrollableIcon visible={overflows && !hasScrolled} />
		</div>
	);
}
