'use client';

import { useRef, useEffect } from 'react';
import { useScrollableElements } from '@/hooks/useScrollableElements';

/**
 * Manages keyboard focus within the SuggestedArtistsCloud `<ul>` list after its items change.
 * Attach `listRef` to the `<ul>` and set `pendingFocusIndexRef.current`
 * to the desired button index before any state change that updates `items`.
 *
 * @param items - The array of list items; a reference change triggers the focus effect
 */
export function useSuggestedArtistCloudFocus<T>(items: T[]) {
	const { getTabbableElements } = useScrollableElements();
	const listRef = useRef<HTMLUListElement>(null);
	const pendingFocusIndexRef = useRef<number | null>(null);

	// Runs after the list re-renders so the new DOM is ready to receive focus
	useEffect(() => {
		if (pendingFocusIndexRef.current === null) return;

		const buttons =
			listRef.current?.querySelectorAll<HTMLButtonElement>('li button');
		const target = buttons?.[pendingFocusIndexRef.current];

		if (target && !target.disabled) {
			target.focus();
		} else if (listRef.current) {
			// (WCAG AA) All buttons are disabled (isFull) find the nearest
			// tabbable element before the list so focus doesn't shift
			// to the top of the DOM
			const list = listRef.current;
			getTabbableElements()
				.filter(
					(el) =>
						!!(
							list.compareDocumentPosition(el) &
							Node.DOCUMENT_POSITION_PRECEDING
						),
				)
				.at(-1)
				?.focus();
		}

		pendingFocusIndexRef.current = null;
	}, [items, getTabbableElements]);

	return { listRef, pendingFocusIndexRef };
}
