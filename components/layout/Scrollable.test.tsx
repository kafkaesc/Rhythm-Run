import { act, fireEvent, render, screen } from '@testing-library/react';
import Scrollable from './Scrollable';

// jsdom's ResizeObserver mock (jest.setup.ts) never fires its callback.
// Override it here so tests can capture and trigger overflow detection.
let resizeCallback: ResizeObserverCallback | undefined;

beforeEach(() => {
	resizeCallback = undefined;
	globalThis.ResizeObserver = class ResizeObserver {
		constructor(cb: ResizeObserverCallback) {
			resizeCallback = cb;
		}
		observe() {
			/* no-op */
		}
		unobserve() {
			/* no-op */
		}
		disconnect() {
			/* no-op */
		}
	};
});

// Simulate a resize where the content overflows the container, which flips
// the component's `overflows` state and reveals the scroll hint.
function triggerOverflow(el: HTMLElement) {
	Object.defineProperty(el, 'scrollHeight', { value: 200, configurable: true });
	Object.defineProperty(el, 'clientHeight', { value: 100, configurable: true });
	act(() => resizeCallback?.([], {} as ResizeObserver));
}

it('Renders the children', () => {
	render(<Scrollable>hello world</Scrollable>);
	const content = screen.getByText(/hello world/i);
	expect(content).toBeInTheDocument();
});

it('Applies the default scroll classes', () => {
	render(<Scrollable data-testid="scroll">hello world</Scrollable>);
	const scroll = screen.getByTestId('scroll');
	expect(scroll).toHaveClass('overflow-y-auto', 'relative');
});

it('Merges a custom className with the default classes', () => {
	render(
		<Scrollable className="bg-red-500" data-testid="scroll">
			hello world
		</Scrollable>,
	);
	const scroll = screen.getByTestId('scroll');
	expect(scroll).toHaveClass('overflow-y-auto', 'relative', 'bg-red-500');
});

it('Applies height and maxHeight as inline styles', () => {
	render(
		<Scrollable data-testid="scroll" height="400px" maxHeight="50dvh">
			hello world
		</Scrollable>,
	);
	const scroll = screen.getByTestId('scroll');
	expect(scroll).toHaveStyle({ height: '400px', maxHeight: '50dvh' });
});

it('Merges a custom style with the dimension styles', () => {
	render(
		<Scrollable
			data-testid="scroll"
			height="400px"
			style={{ background: 'rgb(255, 0, 0)' }}
		>
			hello world
		</Scrollable>,
	);
	const scroll = screen.getByTestId('scroll');
	expect(scroll).toHaveStyle({ height: '400px', background: 'rgb(255, 0, 0)' });
});

it('Hides the scroll hint when the content does not overflow', () => {
	render(<Scrollable>hello world</Scrollable>);
	const hint = screen
		.getByText(/scroll for more/i)
		.closest('.transition-opacity');
	expect(hint).toHaveClass('opacity-0');
});

it('Shows the scroll hint when the content overflows', () => {
	render(<Scrollable data-testid="scroll">hello world</Scrollable>);
	const scroll = screen.getByTestId('scroll');
	triggerOverflow(scroll);
	const hint = screen
		.getByText(/scroll for more/i)
		.closest('.transition-opacity');
	expect(hint).toHaveClass('opacity-100');
});

it('Hides the scroll hint after the user scrolls', () => {
	render(<Scrollable data-testid="scroll">hello world</Scrollable>);
	const scroll = screen.getByTestId('scroll');
	triggerOverflow(scroll);
	fireEvent.scroll(scroll);
	const hint = screen
		.getByText(/scroll for more/i)
		.closest('.transition-opacity');
	expect(hint).toHaveClass('opacity-0');
});

it('Calls the provided onScroll handler when scrolled', () => {
	const onScroll = jest.fn();
	render(
		<Scrollable data-testid="scroll" onScroll={onScroll}>
			hello world
		</Scrollable>,
	);
	const scroll = screen.getByTestId('scroll');
	fireEvent.scroll(scroll);
	expect(onScroll).toHaveBeenCalledTimes(1);
});

it('Forwards every scroll to the onScroll handler after the first', () => {
	const onScroll = jest.fn();
	render(
		<Scrollable data-testid="scroll" onScroll={onScroll}>
			hello world
		</Scrollable>,
	);
	const scroll = screen.getByTestId('scroll');
	fireEvent.scroll(scroll);
	fireEvent.scroll(scroll);
	expect(onScroll).toHaveBeenCalledTimes(2);
});
