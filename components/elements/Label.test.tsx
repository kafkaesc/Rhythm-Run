import { render, screen } from '@testing-library/react';
import Label from './Label';

it('Loads a label element', () => {
	render(<Label>hello world</Label>);
	const label = screen.getByText(/hello world/i);
	expect(label).toBeInTheDocument();
	expect(label).toHaveTextContent(/hello world/i);
});

it('Loads the className prop onto the label element', () => {
	render(<Label className="red">hello world</Label>);
	const label = screen.getByText(/hello world/i);
	expect(label).toBeInTheDocument();
	expect(label).toHaveClass('red');
});

it('Loads the htmlFor prop onto the label element', () => {
	render(<Label htmlFor="my-input">hello world</Label>);
	const label = screen.getByText(/hello world/i);
	expect(label).toHaveAttribute('for', 'my-input');
});
