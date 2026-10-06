import { render } from '@testing-library/react';
import IosBarFill from './IosBarFill';

afterEach(() => {
	document.documentElement.classList.remove('dark');
});

it('Renders a strip hidden from assistive technology', () => {
	const { container } = render(<IosBarFill />);
	const strip = container.querySelector('.ios-bar-fill');
	expect(strip).toBeInTheDocument();
	expect(strip).toHaveAttribute('aria-hidden', 'true');
});

it('Carries the same colours as the footer in both themes', () => {
	const { container } = render(<IosBarFill />);
	const strip = container.querySelector('.ios-bar-fill');
	expect(strip).toHaveClass('bg-dark', 'dark:bg-black');
});

it('Replaces the node when the theme changes so Safari re-samples it', () => {
	const { container, rerender } = render(<IosBarFill />);
	const before = container.querySelector('.ios-bar-fill');
	document.documentElement.classList.add('dark');
	globalThis.dispatchEvent(new Event('theme-change'));
	rerender(<IosBarFill />);
	const after = container.querySelector('.ios-bar-fill');
	expect(after).toBeInTheDocument();
	expect(after).not.toBe(before);
});
