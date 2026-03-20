import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import NavList from './NavList';

jest.mock('next/navigation', () => ({ usePathname: jest.fn() }));

const mockUsePathname = usePathname as jest.Mock;

it('Renders a list of nav items', () => {
	mockUsePathname.mockReturnValue('/');
	render(<NavList />);
	expect(screen.getByRole('list')).toBeInTheDocument();
});

it('Renders a Home link', () => {
	mockUsePathname.mockReturnValue('/');
	render(<NavList />);
	expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
});

it('Renders an About link', () => {
	mockUsePathname.mockReturnValue('/');
	render(<NavList />);
	expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '/about');
});
