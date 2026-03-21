import { render, screen } from '@testing-library/react';
import A from './A';

it('Loads an a-element', () => {
	render(<A href="#">hello world</A>);
	const link = screen.getByRole('link');
	expect(link).toBeInTheDocument();
	expect(link).toHaveTextContent(/hello world/i);
});

it('Loads the className prop onto the child a-element', () => {
	render(
		<A href="#" className="red">
			hello world, but red
		</A>,
	);
	const link = screen.getByRole('link');
	expect(link).toBeInTheDocument();
	expect(link).toHaveTextContent(/hello world, but red/i);
	expect(link).toHaveClass('red');
});

it('Loads an a-element without the href prop', () => {
	render(<A>link text</A>);
	const link = screen.getByText(/link/i);
	expect(link).toBeInTheDocument();
	expect(link).toHaveTextContent(/link text/i);
	expect(link).not.toHaveAttribute('href');
});

it('Loads an internal link with the href attribute', () => {
	render(<A href="/about">About</A>);
	const link = screen.getByRole('link', { name: /about/i });
	expect(link).toBeInTheDocument();
	expect(link).toHaveAttribute('href', '/about');
});

it('Loads an external link with the target and rel attributes', () => {
	render(<A href="https://jaredhettinger.io">jaredhettinger.io</A>);
	const link = screen.getByRole('link', { name: /jaredhettinger/i });
	expect(link).toBeInTheDocument();
	expect(link).toHaveAttribute('href', 'https://jaredhettinger.io');
	expect(link).toHaveAttribute('target', '_blank');
	expect(link).toHaveAttribute('rel', 'noopener noreferrer');
});
