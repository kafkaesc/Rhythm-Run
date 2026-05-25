import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import AuthNavItem from './AuthNavItem';

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

it('Renders a Login link when logged out', () => {
	render(<AuthNavItem />);
	const loginLink = screen.getByRole('link', { name: /login/i });
	expect(loginLink).toBeInTheDocument();
	expect(loginLink).toHaveAttribute('href', '/login');
});

it('Renders a Profile link when logged in', () => {
	mockUseSession.mockReturnValue({ data: { user: { name: 'Gregor Samsa' } } });
	render(<AuthNavItem />);
	const profileLink = screen.getByRole('link', { name: /profile/i });
	expect(profileLink).toBeInTheDocument();
	expect(profileLink).toHaveAttribute('href', '/profile');
});
