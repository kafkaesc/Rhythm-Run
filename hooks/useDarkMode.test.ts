import { act, renderHook } from '@testing-library/react';
import { useDarkMode } from './useDarkMode';

afterEach(() => {
	document.documentElement.classList.remove('dark');
	localStorage.clear();
});

it('Returns isDark false when dark class is not set', () => {
	const { result } = renderHook(() => useDarkMode());
	expect(result.current.isDark).toBe(false);
});

it('Returns isDark true when dark class is set', () => {
	document.documentElement.classList.add('dark');
	const { result } = renderHook(() => useDarkMode());
	expect(result.current.isDark).toBe(true);
});

it('Toggle adds the dark class to the document', () => {
	const { result } = renderHook(() => useDarkMode());
	act(() => result.current.toggle());
	expect(document.documentElement.classList.contains('dark')).toBe(true);
});

it('Toggle sets localStorage to dark and updates isDark to true', () => {
	const { result } = renderHook(() => useDarkMode());
	act(() => result.current.toggle());
	expect(localStorage.getItem('tr-theme')).toBe('dark');
	expect(result.current.isDark).toBe(true);
});

it('Toggle switches from dark to light', () => {
	document.documentElement.classList.add('dark');
	const { result } = renderHook(() => useDarkMode());
	act(() => result.current.toggle());
	expect(result.current.isDark).toBe(false);
	expect(document.documentElement.classList.contains('dark')).toBe(false);
	expect(localStorage.getItem('tr-theme')).toBe('light');
});

it('Toggle dispatches a theme-change event', () => {
	const listener = jest.fn();
	window.addEventListener('theme-change', listener);
	const { result } = renderHook(() => useDarkMode());
	act(() => result.current.toggle());
	expect(listener).toHaveBeenCalledTimes(1);
	window.removeEventListener('theme-change', listener);
});
