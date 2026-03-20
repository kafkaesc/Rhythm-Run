import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import NavItem from './NavItem';

jest.mock('next/navigation', () => ({ usePathname: jest.fn() }));

const mockUsePathname = usePathname as jest.Mock;

it('Renders an internal link with the correct href and text', () => {
	mockUsePathname.mockReturnValue('/home');
	render(<NavItem href="/about">About</NavItem>);
	const link = screen.getByRole('link', { name: /about/i });
	expect(link).toBeInTheDocument();
	expect(link).toHaveAttribute('href', '/about');
});

it('Applies active styles when the href matches the current page', () => {
	mockUsePathname.mockReturnValue('/home');
	render(<NavItem href="/home">Home</NavItem>);
	const item = screen.getByRole('listitem');
	expect(item).toHaveClass('bg-foreground', 'text-background');
});

it('Does not apply active styles when the href does not match the current page', () => {
	mockUsePathname.mockReturnValue('/home');
	render(<NavItem href="/about">About</NavItem>);
	const item = screen.getByRole('listitem');
	expect(item).not.toHaveClass('bg-foreground', 'text-background');
});

it('Renders an external link with the expected attributes', () => {
	mockUsePathname.mockReturnValue('/');
	render(<NavItem href="https://jaredhettinger.io">jaredhettinger.io</NavItem>);
	const link = screen.getByRole('link', { name: /jaredhettinger/i });
	expect(link).toHaveAttribute('target', '_blank');
	expect(link).toHaveAttribute('rel', 'noopener noreferrer');
});
