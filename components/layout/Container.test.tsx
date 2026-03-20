import { render, screen } from '@testing-library/react';
import Container from './Container';

it('Renders its children', () => {
	render(<Container>hello world</Container>);
	expect(screen.getByText(/hello world/i)).toBeInTheDocument();
});

it('Applies default layout classes', () => {
	render(<Container>hello world</Container>);
	const container = screen.getByText(/hello world/i);
	expect(container).toHaveClass('mx-auto', 'w-full', 'max-w-4xl', 'px-4');
});

it('Merges a custom className with the default classes', () => {
	render(<Container className="bg-red-500">hello world</Container>);
	const container = screen.getByText(/hello world/i);
	expect(container).toHaveClass('bg-red-500');
});

it('Passes extra props to the div', () => {
	render(<Container data-testid="content-target">hello world</Container>);
	expect(screen.getByTestId('content-target')).toBeInTheDocument();
});
