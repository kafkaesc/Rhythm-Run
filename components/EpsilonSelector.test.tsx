import { render, screen, fireEvent } from '@testing-library/react';
import EpsilonSelector from './EpsilonSelector';

it('Renders the default title', () => {
	render(<EpsilonSelector />);
	const group = screen.getByRole('group', { name: /tempo range/i });
	expect(group).toBeInTheDocument();
});

it('Renders a custom title when provided', () => {
	render(<EpsilonSelector title="BPM Variance" />);
	const group = screen.getByRole('group', { name: /bpm variance/i });
	expect(group).toBeInTheDocument();
});

it('Renders the number input with default value of 4', () => {
	render(<EpsilonSelector />);
	const spinner = screen.getByRole('spinbutton');
	expect(spinner).toHaveValue(4);
});

it('Number input has correct min and max attributes', () => {
	render(<EpsilonSelector />);
	const spinner = screen.getByRole('spinbutton');
	expect(spinner).toHaveAttribute('min', '0');
	expect(spinner).toHaveAttribute('max', '20');
});

it('Renders the ± prefix', () => {
	render(<EpsilonSelector />);
	const prefix = screen.getByText('±');
	expect(prefix).toBeInTheDocument();
});

it('Calls onChange with the new value when input changes', () => {
	const onChange = jest.fn();
	render(<EpsilonSelector onChange={onChange} />);
	const spinner = screen.getByRole('spinbutton');
	fireEvent.change(spinner, { target: { value: '5' } });
	expect(onChange).toHaveBeenCalledWith(5);
});

it('Clamps value to 0 when input is below 0', () => {
	const onChange = jest.fn();
	render(<EpsilonSelector onChange={onChange} />);
	const spinner = screen.getByRole('spinbutton');
	fireEvent.change(spinner, { target: { value: '-5' } });
	expect(onChange).toHaveBeenCalledWith(0);
	expect(spinner).toHaveValue(0);
});

it('Clamps value to 20 when input is above 20', () => {
	const onChange = jest.fn();
	render(<EpsilonSelector onChange={onChange} />);
	const spinner = screen.getByRole('spinbutton');
	fireEvent.change(spinner, { target: { value: '50' } });
	expect(onChange).toHaveBeenCalledWith(20);
	expect(spinner).toHaveValue(20);
});

it('Does not call onChange when field is cleared', () => {
	const onChange = jest.fn();
	render(<EpsilonSelector onChange={onChange} />);
	const spinner = screen.getByRole('spinbutton');
	fireEvent.change(spinner, { target: { value: '' } });
	expect(onChange).not.toHaveBeenCalled();
});

it('Does not show a leading zero when field is cleared and a new value is typed', () => {
	render(<EpsilonSelector />);
	const spinner = screen.getByRole('spinbutton');
	fireEvent.change(spinner, { target: { value: '' } });
	fireEvent.change(spinner, { target: { value: '1' } });
	expect(spinner).toHaveDisplayValue('1');
});

it('Restores the initial value and calls onChange on blur when field is empty', () => {
	const onChange = jest.fn();
	render(<EpsilonSelector onChange={onChange} />);
	const spinner = screen.getByRole('spinbutton');
	fireEvent.change(spinner, { target: { value: '' } });
	fireEvent.blur(spinner);
	expect(spinner).toHaveValue(4);
	expect(onChange).toHaveBeenCalledWith(4);
});
