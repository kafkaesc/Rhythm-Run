import { cn } from './css-utils';

it('Joins multiple class names into a single string', () => {
	const result = cn('px-2', 'py-1');
	expect(result).toBe('px-2 py-1');
});

it('Resolves Tailwind conflicts with later inputs winning', () => {
	const result = cn('px-2', 'px-4');
	expect(result).toBe('px-4');
});

it('Ignores falsy conditional values', () => {
	const result = cn('text-sm', false, null, undefined, 'font-bold');
	expect(result).toBe('text-sm font-bold');
});

it('Applies a class from a conditional object when truthy', () => {
	const result = cn('base', { 'text-red-500': true, 'text-blue-500': false });
	expect(result).toBe('base text-red-500');
});

it('Flattens array inputs', () => {
	const result = cn(['px-2', 'py-1'], 'm-0');
	expect(result).toBe('px-2 py-1 m-0');
});

it('Returns an empty string when given no inputs', () => {
	const result = cn();
	expect(result).toBe('');
});
