import { render, screen } from '@testing-library/react';
import PoweredBy from './PoweredBy';

it('Renders the GetSongBPM link with the correct href', () => {
	render(<PoweredBy />);
	const link = screen.getByRole('link', { name: /getsongbpm/i });
	expect(link).toBeInTheDocument();
	expect(link).toHaveAttribute('href', 'https://www.getsongbpm.com/api');
});

it('Renders the Last.fm link with the correct href', () => {
	render(<PoweredBy />);
	const link = screen.getByRole('link', { name: /last\.fm/i });
	expect(link).toBeInTheDocument();
	expect(link).toHaveAttribute('href', 'https://www.last.fm/api');
});

it('Renders all power source links', () => {
	render(<PoweredBy />);
	const links = screen.getAllByRole('link');
	expect(links).toHaveLength(2);
});
