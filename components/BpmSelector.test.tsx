import { render, screen, fireEvent } from '@testing-library/react';
import BpmSelector from './BpmSelector';

it('Renders the default title', () => {
	render(<BpmSelector />);
	const group = screen.getByRole('group', { name: /select target tempo/i });
	expect(group).toBeInTheDocument();
});

it('Renders a custom title when provided', () => {
	render(<BpmSelector title="Choose Tempo" />);
	const group = screen.getByRole('group', { name: /choose tempo/i });
	expect(group).toBeInTheDocument();
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

it('Changing the number input updates the slider on blur', () => {
	render(<BpmSelector />);
	const spinner = screen.getByRole('spinbutton');
	fireEvent.change(spinner, { target: { value: '140' } });
	fireEvent.blur(spinner);
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

it('Calls onChange with the new value when number input blurs', () => {
	const onChange = jest.fn();
	render(<BpmSelector onChange={onChange} />);
	const spinner = screen.getByRole('spinbutton');
	fireEvent.change(spinner, { target: { value: '150' } });
	fireEvent.blur(spinner);
	expect(onChange).toHaveBeenCalledWith(150);
});

it('Clamps value to MIN_BPM when input is below 60', () => {
	const onChange = jest.fn();
	render(<BpmSelector onChange={onChange} />);
	const spinner = screen.getByRole('spinbutton');
	fireEvent.change(spinner, { target: { value: '10' } });
	fireEvent.blur(spinner);
	expect(onChange).toHaveBeenCalledWith(60);
	expect(spinner).toHaveValue(60);
});

it('Clamps value to MAX_BPM when input is above 220', () => {
	const onChange = jest.fn();
	render(<BpmSelector onChange={onChange} />);
	const spinner = screen.getByRole('spinbutton');
	fireEvent.change(spinner, { target: { value: '300' } });
	fireEvent.blur(spinner);
	expect(onChange).toHaveBeenCalledWith(220);
	expect(spinner).toHaveValue(220);
});

it('Commits value when ArrowUp is pressed', () => {
	const onChange = jest.fn();
	render(<BpmSelector onChange={onChange} />);
	const spinner = screen.getByRole('spinbutton');
	fireEvent.keyDown(spinner, { key: 'ArrowUp' });
	fireEvent.change(spinner, { target: { value: '161' } });
	expect(onChange).toHaveBeenCalledWith(161);
});

it('Commits value when ArrowDown is pressed', () => {
	const onChange = jest.fn();
	render(<BpmSelector onChange={onChange} />);
	const spinner = screen.getByRole('spinbutton');
	fireEvent.keyDown(spinner, { key: 'ArrowDown' });
	fireEvent.change(spinner, { target: { value: '159' } });
	expect(onChange).toHaveBeenCalledWith(159);
});

it('Commits value when Enter is pressed', () => {
	const onChange = jest.fn();
	render(<BpmSelector onChange={onChange} />);
	const spinner = screen.getByRole('spinbutton');
	fireEvent.change(spinner, { target: { value: '140' } });
	fireEvent.keyDown(spinner, { key: 'Enter' });
	expect(onChange).toHaveBeenCalledWith(140);
});

it('Resets to last valid BPM when input is cleared and blurred', () => {
	render(<BpmSelector />);
	const spinner = screen.getByRole('spinbutton');
	fireEvent.change(spinner, { target: { value: '' } });
	fireEvent.blur(spinner);
	expect(spinner).toHaveValue(160);
});
