import { render, screen } from '@testing-library/react';
import H1 from './H1';

it('Loads an H1 element', () => {
	render(<H1>hello world</H1>);
	const heading = screen.getByRole('heading', { level: 1 });
	expect(heading).toBeInTheDocument();
	expect(heading).toHaveTextContent(/hello world/i);
});

it('Loads the className prop onto the child h1 element', () => {
	render(<H1 className="red">hello world, but red</H1>);
	const heading = screen.getByRole('heading', { level: 1 });
	expect(heading).toBeInTheDocument();
	expect(heading).toHaveTextContent(/hello world, but red/i);
	expect(heading).toHaveClass('red');
});
