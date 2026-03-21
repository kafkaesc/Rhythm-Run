import { render, screen } from '@testing-library/react';
import Input from './Input';

it('Loads an input element', () => {
	render(<Input />);
	expect(screen.getByRole('textbox')).toBeInTheDocument();
});

it('Loads the placeholder prop', () => {
	render(<Input placeholder="Search" />);
	expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
});

it('Loads the name prop', () => {
	render(<Input name="searchQuery" />);
	expect(screen.getByRole('textbox')).toHaveAttribute('name', 'searchQuery');
});

it('Loads a className prop onto the input element', () => {
	render(<Input className="red" />);
	expect(screen.getByRole('textbox')).toHaveClass('red');
});
