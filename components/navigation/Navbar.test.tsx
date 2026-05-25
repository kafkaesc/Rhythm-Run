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
	const homeLink = screen.getByRole('link', { name: /home/i });
	const aboutLink = screen.getByRole('link', { name: /about/i });
	expect(homeLink).toBeInTheDocument();
	expect(aboutLink).toBeInTheDocument();
});

it('Renders the dark mode toggle', () => {
	render(<Navbar />);
	const lightToggle = screen.getByRole('button', {
		name: /toggle light mode/i,
	});
	const darkToggle = screen.getByRole('button', { name: /toggle dark mode/i });
	expect(lightToggle).toBeInTheDocument();
	expect(darkToggle).toBeInTheDocument();
});
