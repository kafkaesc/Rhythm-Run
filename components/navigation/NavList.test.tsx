import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import NavList from './NavList';

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

it('Renders a list of nav items', () => {
	render(<NavList />);
	const list = screen.getByRole('list');
	expect(list).toBeInTheDocument();
});

it('Renders a Home link', () => {
	render(<NavList />);
	const homeLink = screen.getByRole('link', { name: /home/i });
	expect(homeLink).toHaveAttribute('href', '/');
});

it('Renders an About link', () => {
	render(<NavList />);
	const aboutLink = screen.getByRole('link', { name: /about/i });
	expect(aboutLink).toHaveAttribute('href', '/about');
});
