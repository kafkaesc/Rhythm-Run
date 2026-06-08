import { render, screen } from '@testing-library/react';
import ProxyWarning from './ProxyWarning';

it('Renders the proxy warning message without an artistCount', () => {
	render(<ProxyWarning />);
	expect(screen.getByText(/security software/i)).toBeInTheDocument();
});

it('Does not show an estimate when artistCount is not provided', () => {
	render(<ProxyWarning />);
	expect(screen.queryByText(/estimated wait/i)).not.toBeInTheDocument();
});

it('Shows a 2 minute estimate for 1 artist', () => {
	render(<ProxyWarning artistCount={1} />);
	expect(screen.getByText(/up to 2 minutes/i)).toBeInTheDocument();
});

it('Shows a plural minutes estimate for multiple artists', () => {
	render(<ProxyWarning artistCount={3} />);
	expect(screen.getByText(/up to 4 minutes/i)).toBeInTheDocument();
});

it('Mentions that results are held until finished', () => {
	render(<ProxyWarning artistCount={1} />);
	expect(
		screen.getByText(/holding onto results until everything is finished/i),
	).toBeInTheDocument();
});
