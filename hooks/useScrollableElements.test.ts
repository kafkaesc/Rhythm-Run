import { renderHook } from '@testing-library/react';
import { useScrollableElements } from './useScrollableElements';

// JSDOM does not implement layout; mock offsetParent so visible elements are included
Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
	get() {
		return document.body;
	},
	configurable: true,
});

afterEach(() => {
	document.body.innerHTML = '';
});

it('Returns a getTabbableElements function', () => {
	const { result } = renderHook(() => useScrollableElements());
	expect(typeof result.current.getTabbableElements).toBe('function');
});

it('getTabbableElements returns buttons, links, and inputs', () => {
	document.body.innerHTML = `
		<button>Click Me</button>
		<a href="https://github.com/kafkaesc">My GitHub</a>
		<input type="text" />
	`;
	const { result } = renderHook(() => useScrollableElements());
	expect(result.current.getTabbableElements()).toHaveLength(3);
});

it('getTabbableElements excludes disabled buttons', () => {
	document.body.innerHTML = `
		<button>Enabled</button>
		<button disabled>Disabled</button>
	`;
	const { result } = renderHook(() => useScrollableElements());
	expect(result.current.getTabbableElements()).toHaveLength(1);
});

it('getTabbableElements excludes elements with tabindex="-1"', () => {
	document.body.innerHTML = `
		<button>Enabled</button>
		<button tabindex="-1">-1</button>
	`;
	const { result } = renderHook(() => useScrollableElements());
	expect(result.current.getTabbableElements()).toHaveLength(1);
});

it('getTabbableElements returns a stable function reference across renders', () => {
	const { result, rerender } = renderHook(() => useScrollableElements());
	const first = result.current.getTabbableElements;
	rerender();
	expect(result.current.getTabbableElements).toBe(first);
});
