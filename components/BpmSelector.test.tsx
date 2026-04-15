import { render, screen, fireEvent } from '@testing-library/react';
import BpmSelector from './BpmSelector';

it('Renders the default heading', () => {
	render(<BpmSelector />);
	const heading = screen.getByRole('heading', { level: 2 });
	expect(heading).toHaveTextContent('Select BPM');
});

it('Renders a custom title when provided', () => {
	render(<BpmSelector title="Choose Tempo" />);
	const heading = screen.getByRole('heading', { level: 2 });
	expect(heading).toHaveTextContent('Choose Tempo');
});

it('Renders the slider with default BPM value', () => {
	render(<BpmSelector />);
	const slider = screen.getByRole('slider');
	expect(slider).toHaveValue('160');
});

it('Renders the number input with default BPM value', () => {
	render(<BpmSelector />);
	const spinner = screen.getByRole('spinbutton');
	expect(spinner).toHaveValue(160);
});

it('Slider has correct min and max attributes', () => {
	render(<BpmSelector />);
	const slider = screen.getByRole('slider');
	expect(slider).toHaveAttribute('min', '60');
	expect(slider).toHaveAttribute('max', '220');
});

it('Number input has correct min and max attributes', () => {
	render(<BpmSelector />);
	const input = screen.getByRole('spinbutton');
	expect(input).toHaveAttribute('min', '60');
	expect(input).toHaveAttribute('max', '220');
});

it('Changing the slider updates the number input', () => {
	render(<BpmSelector />);
	const slider = screen.getByRole('slider');
	fireEvent.change(slider, { target: { value: '180' } });
	const spinner = screen.getByRole('spinbutton');
	expect(spinner).toHaveValue(180);
});

it('Changing the number input updates the slider', () => {
	render(<BpmSelector />);
	const spinner = screen.getByRole('spinbutton');
	fireEvent.change(spinner, { target: { value: '140' } });
	const slider = screen.getByRole('slider');
	expect(slider).toHaveValue('140');
});

it('Calls onChange with the new value when slider changes', () => {
	const onChange = jest.fn();
	render(<BpmSelector onChange={onChange} />);
	const slider = screen.getByRole('slider');
	fireEvent.change(slider, { target: { value: '170' } });
	expect(onChange).toHaveBeenCalledWith(170);
});

it('Calls onChange with the new value when number input changes', () => {
	const onChange = jest.fn();
	render(<BpmSelector onChange={onChange} />);
	const spinner = screen.getByRole('spinbutton');
	fireEvent.change(spinner, { target: { value: '150' } });
	expect(onChange).toHaveBeenCalledWith(150);
});

it('Clamps value to MIN_BPM when input is below 60', () => {
	const onChange = jest.fn();
	render(<BpmSelector onChange={onChange} />);
	const spinner = screen.getByRole('spinbutton');
	fireEvent.change(spinner, { target: { value: '10' } });
	expect(onChange).toHaveBeenCalledWith(60);
	expect(spinner).toHaveValue(60);
});

it('Clamps value to MAX_BPM when input is above 220', () => {
	const onChange = jest.fn();
	render(<BpmSelector onChange={onChange} />);
	const spinner = screen.getByRole('spinbutton');
	fireEvent.change(spinner, { target: { value: '300' } });
	expect(onChange).toHaveBeenCalledWith(220);
	expect(spinner).toHaveValue(220);
});
