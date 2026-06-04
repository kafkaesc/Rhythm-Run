import { act, renderHook } from '@testing-library/react';
import { useSuggestedArtistCloudFocus } from './useSuggestedArtistCloudFocus';

it('Returns a listRef with initial value null', () => {
	const { result } = renderHook(() => useSuggestedArtistCloudFocus([]));
	expect(result.current.listRef.current).toBeNull();
});

it('Returns a pendingFocusIndexRef with initial value null', () => {
	const { result } = renderHook(() => useSuggestedArtistCloudFocus([]));
	expect(result.current.pendingFocusIndexRef.current).toBeNull();
});

it('Clears pendingFocusIndexRef after items change', () => {
	const { result, rerender } = renderHook(
		({ items }: { items: string[] }) => useSuggestedArtistCloudFocus(items),
		{ initialProps: { items: ['A1', 'B2'] } },
	);
	act(() => {
		result.current.pendingFocusIndexRef.current = 0;
	});
	rerender({ items: ['B1'] });
	expect(result.current.pendingFocusIndexRef.current).toBeNull();
});
