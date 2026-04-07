import { act, renderHook } from '@testing-library/react';
import { useSet } from './useSet';

it('Adds an item to the set', () => {
	const { result } = renderHook(() => useSet<string>());
	act(() => result.current.add('base'));
	expect(result.current.set).toEqual(['base']);
});

it('Does not add a duplicate item', () => {
	const { result } = renderHook(() => useSet<string>());
	act(() => result.current.add('base'));
	act(() => result.current.add('base'));
	expect(result.current.set).toEqual(['base']);
});

it('Uses the key function and prevents override or duplicates', () => {
	const { result } = renderHook(() =>
		useSet<{ id: number; name: string }>({ key: (i) => i.id }),
	);
	act(() => result.current.add({ id: 1, name: 'base' }));
	act(() => result.current.add({ id: 1, name: 'tempo' }));
	expect(result.current.set).toHaveLength(1);
	expect(result.current.set[0].name).toBe('base');
});

it('Cannot exceed the limit', () => {
	const { result } = renderHook(() => useSet<string>({ limit: 2 }));
	act(() => result.current.add('base'));
	act(() => result.current.add('tempo'));
	act(() => result.current.add('long'));
	expect(result.current.set).toEqual(['base', 'tempo']);
});

it('Clears all items from the set', () => {
	const { result } = renderHook(() => useSet<string>());
	act(() => result.current.add('base'));
	act(() => result.current.add('tempo'));
	act(() => result.current.clear());
	expect(result.current.set).toEqual([]);
});

it('Calls isFull and gets false when no limit is set', () => {
	const { result } = renderHook(() => useSet<string>());
	expect(result.current.isFull()).toBe(false);
});

it('Calls isFull and gets false when the limit has not been reached', () => {
	const { result } = renderHook(() => useSet<string>({ limit: 3 }));
	act(() => result.current.add('base'));
	act(() => result.current.add('tempo'));
	expect(result.current.isFull()).toBe(false);
});

it('Calls isFull and gets true when the limit has been reached', () => {
	const { result } = renderHook(() => useSet<string>({ limit: 3 }));
	act(() => result.current.add('base'));
	act(() => result.current.add('tempo'));
	act(() => result.current.add('interval'));
	expect(result.current.isFull()).toBe(true);
});

it('Removes an item from the set', () => {
	const { result } = renderHook(() => useSet<string>());
	act(() => result.current.add('base'));
	act(() => result.current.add('tempo'));
	act(() => result.current.remove('base'));
	expect(result.current.set).toEqual(['tempo']);
});

it('Remove does nothing if the item is not in the set', () => {
	const { result } = renderHook(() => useSet<string>());
	act(() => result.current.add('base'));
	act(() => result.current.remove('tempo'));
	expect(result.current.set).toEqual(['base']);
});
