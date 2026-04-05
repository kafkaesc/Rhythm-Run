import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

it('Renders a button element', () => {
	render(<Button>Click me</Button>);
	const btn = screen.getByRole('button');
	expect(btn).toBeInTheDocument();
	expect(btn).toHaveTextContent('Click me');
});

it('Applies a className prop', () => {
	render(<Button className="border border-red-500">Click me</Button>);
	const btn = screen.getByRole('button');
	expect(btn).toHaveClass('border');
	expect(btn).toHaveClass('border-red-500');
});

it('Calls onClick when clicked', async () => {
	const onClick = jest.fn();
	render(<Button onClick={onClick}>Click me</Button>);
	const btn = screen.getByRole('button');
	await userEvent.click(btn);
	await userEvent.click(btn);
	await userEvent.click(btn);
	expect(onClick).toHaveBeenCalledTimes(3);
});

it('Cannot call onClick when disabled', async () => {
	const onClick = jest.fn();
	render(
		<Button onClick={onClick} disabled>
			Click me
		</Button>,
	);
	const btn = screen.getByRole('button');
	await userEvent.click(btn);
	await userEvent.click(btn);
	await userEvent.click(btn);
	expect(onClick).not.toHaveBeenCalled();
});
