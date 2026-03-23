import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes while resolving conflicts using clsx and tailwind-merge.
 * If there are class conflicts ☭, later inputs take priority over earlier ones.
 * @param inputs - Class names or conditional class expressions
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
