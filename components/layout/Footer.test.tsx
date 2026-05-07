import { render, screen } from '@testing-library/react';
import Footer from './Footer';

jest.mock('@iconify/react', () => ({
	Icon: () => <svg />,
}));

it('Renders the footer element', () => {
	render(<Footer />);
	const footer = screen.getByRole('contentinfo');
	expect(footer).toBeInTheDocument();
});

it('Renders the built-by heading', () => {
	render(<Footer />);
	const heading = screen.getByText(/built by jared hettinger/i);
	expect(heading).toBeInTheDocument();
});

it('Renders the powered-by heading', () => {
	render(<Footer />);
	const heading = screen.getByText(/powered by/i);
	expect(heading).toBeInTheDocument();
});

it('Renders the social links', () => {
	render(<Footer />);
	const github = screen.getByRole('link', { name: /github/i });
	const linkedin = screen.getByRole('link', { name: /linkedin/i });
	expect(github).toBeInTheDocument();
	expect(linkedin).toBeInTheDocument();
});

it('Renders the API source links', () => {
	render(<Footer />);
	const getsongbpm = screen.getByRole('link', { name: /getsongbpm/i });
	const lastfm = screen.getByRole('link', { name: /last\.fm/i });
	expect(getsongbpm).toBeInTheDocument();
	expect(lastfm).toBeInTheDocument();
});
