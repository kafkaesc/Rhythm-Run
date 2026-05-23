export const MS_PER_SECOND = 1000;
export const SECONDS_PER_MINUTE = 60;

/**
 * Clamps a value to the inclusive range [min, max].
 *
 * @param value - The number to clamp
 * @param min - The lower bound
 * @param max - The upper bound
 */
export function clamp(value: number, min: number, max: number): number {
	// https://www.youtube.com/watch?v=sVOpqbJYXp8
	return Math.min(max, Math.max(min, value));
}

/**
 * Returns true if value is within ±epsilon of target (inclusive).
 *
 * @param value - The number to test
 * @param target - The center of the range
 * @param epsilon - The half-width of the range
 */
export function inRange(value: number, target: number, epsilon: number): boolean {
	return value >= target - epsilon && value <= target + epsilon;
}
