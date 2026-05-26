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
	const nav = screen.getByRole('navigation');
	expect(nav).toBeInTheDocument();
});

it('Renders the site navigation links', () => {
	render(<Navbar />);
	const homeLink = screen.getByRole('link', { name: /home/i });
	const aboutLink = screen.getByRole('link', { name: /about/i });
	expect(homeLink).toBeInTheDocument();
	expect(aboutLink).toBeInTheDocument();
});

it('Renders the dark mode toggle', () => {
	render(<Navbar />);
	const lightButtons = screen.getAllByRole('button', {
		name: /toggle light mode/i,
	});
	const darkButtons = screen.getAllByRole('button', {
		name: /toggle dark mode/i,
	});
	expect(lightButtons.length).toBeGreaterThan(0);
	expect(darkButtons.length).toBeGreaterThan(0);
});
