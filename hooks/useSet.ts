'use client';

import { useState } from 'react';

type useSetArgs<T> = {
	limit?: number;
	key?: (item: T) => unknown;
};

/** A hook to manage a set of items with an optional limit and basic utility functions */
export function useSet<T>({ limit, key }: useSetArgs<T> = {}) {
	// A set of items of type T
	const [set, setSet] = useState<T[]>([]);

	/** Add an item to the set, unless it has a limit that has been reached */
	function add(item: T) {
		// If a key function is provided, use it to check for duplicates
		if (key && set.some((i) => key(i) === key(item))) return;

		// If no key function is provided, check for duplicates using the item itself
		if (!key && set.includes(item)) return;

		// If a limit set has reached its limit, do not add more items
		if (limit && set.length >= limit) {
			console.warn('Set limit reached, cannot add more items');
			return;
		}
		setSet([...set, item]);
	}

	/** Clear all items from the set */
	function clear() {
		setSet([]);
	}

	/** Returns true if the set has reached its limit */
	function isFull() {
		return limit ? set.length >= limit : false;
	}

	/** Remove an item from the set */
	function remove(item: T) {
		const index = set.indexOf(item);
		if (index !== -1) {
			const newSet = [...set];
			newSet.splice(index, 1);
			setSet(newSet);
		}
	}

	return { set: set, add, clear, isFull, remove };
}
