import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';

it('Renders the brand link', () => {
	render(<Navbar />);
	const brand = screen.getByRole('link', { name: /rhythm run/i });
	expect(brand).toBeInTheDocument();
	expect(brand).toHaveAttribute('href', '/');
});

it('Renders the nav element', () => {
	render(<Navbar />);
	expect(screen.getByRole('navigation')).toBeInTheDocument();
});

it('Renders the site navigation links', () => {
	render(<Navbar />);
	expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
	expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
});

it('Renders the dark mode toggle', () => {
	render(<Navbar />);
	expect(
		screen.getByRole('button', { name: /toggle light mode/i }),
	).toBeInTheDocument();
	expect(
		screen.getByRole('button', { name: /toggle dark mode/i }),
	).toBeInTheDocument();
});
