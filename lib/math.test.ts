import { clamp, inRange } from './math';

it('Clamps to min when value is below min', () => {
	const result = clamp(5, 10, 20);
	expect(result).toBe(10);
});

it('Clamps to max when value is above max', () => {
	const result = clamp(25, 10, 20);
	expect(result).toBe(20);
});

it(`Doesn't clamp when the value is within range`, () => {
	const result = clamp(15, 10, 20);
	expect(result).toBe(15);
});

it('Clamps to min when value equals min', () => {
	const result = clamp(10, 10, 20);
	expect(result).toBe(10);
});

it('Clamps to max when value equals max', () => {
	const result = clamp(20, 10, 20);
	expect(result).toBe(20);
});

it('inRange is true when value equals target', () => {
	const result = inRange(140, 140, 10);
	expect(result).toBe(true);
});

it('inRange is true when value is within epsilon', () => {
	const result = inRange(145, 140, 10);
	expect(result).toBe(true);
});

it('inRange is true at the upper boundary', () => {
	const result = inRange(150, 140, 10);
	expect(result).toBe(true);
});

it('inRange is true at the lower boundary', () => {
	const result = inRange(130, 140, 10);
	expect(result).toBe(true);
});

it('inRange is false when value is above the upper boundary', () => {
	const result = inRange(151, 140, 10);
	expect(result).toBe(false);
});

it('inRange is false when value is below the lower boundary', () => {
	const result = inRange(129, 140, 10);
	expect(result).toBe(false);
});

it('inRange is true for exact match and epsilon zero', () => {
	const result = inRange(140, 140, 0);
	expect(result).toBe(true);
});

it('inRange is false for non-match and epsilon 0', () => {
	const result = inRange(141, 140, 0);
	expect(result).toBe(false);
});
