import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

// Mock the useSession hook to test the Login/Profile NavItem components
jest.mock('next-auth/react', () => ({ useSession: jest.fn() }));
const mockUseSession = useSession as jest.Mock;

// Mock the usePathname hook to test the active link state
jest.mock('next/navigation', () => ({ usePathname: jest.fn() }));
const mockUsePathname = usePathname as jest.Mock;

// Default to a logged out state before each test
beforeEach(() => {
	mockUseSession.mockReturnValue({ data: null });
	mockUsePathname.mockReturnValue('/');
});

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
	const homeLinks = screen.getAllByRole('link', { name: /home/i });
	const aboutLinks = screen.getAllByRole('link', { name: /about/i });
	expect(homeLinks.length).toBeGreaterThan(0);
	expect(aboutLinks.length).toBeGreaterThan(0);
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
