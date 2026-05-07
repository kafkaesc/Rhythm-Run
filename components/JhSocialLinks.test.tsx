import { render, screen } from '@testing-library/react';
import JhSocialLinks from './JhSocialLinks';

jest.mock('@iconify/react', () => ({
	Icon: () => <svg />,
}));

it('Renders the GitHub link with the correct href', () => {
	render(<JhSocialLinks />);
	const link = screen.getByRole('link', { name: /github/i });
	expect(link).toBeInTheDocument();
	expect(link).toHaveAttribute('href', 'https://github.com/kafkaesc');
});

it('Renders the X/Twitter link with the correct href', () => {
	render(<JhSocialLinks />);
	const link = screen.getByRole('link', { name: /x\/twitter/i });
	expect(link).toBeInTheDocument();
	expect(link).toHaveAttribute('href', 'https://x.com/_kafkaesc');
});

it('Renders the Instagram link with the correct href', () => {
	render(<JhSocialLinks />);
	const link = screen.getByRole('link', { name: /instagram/i });
	expect(link).toBeInTheDocument();
	expect(link).toHaveAttribute('href', 'https://instagram.com/kafkaesc');
});

it('Renders the LinkedIn link with the correct href', () => {
	render(<JhSocialLinks />);
	const link = screen.getByRole('link', { name: /linkedin/i });
	expect(link).toBeInTheDocument();
	expect(link).toHaveAttribute('href', 'https://linkedin.com/in/jahettinger');
});

it('Applies light color mode styles to all links', () => {
	render(<JhSocialLinks colorMode="light" />);
	const links = screen.getAllByRole('link');
	links.forEach((link) => {
		expect(link).toHaveClass('text-light');
	});
});

it('Applies dark color mode styles to all links', () => {
	render(<JhSocialLinks colorMode="dark" />);
	const links = screen.getAllByRole('link');
	links.forEach((link) => {
		expect(link).toHaveClass('text-dark');
	});
});
