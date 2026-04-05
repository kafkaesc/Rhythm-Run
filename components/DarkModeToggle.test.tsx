import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import DarkModeToggle from './DarkModeToggle';

const mockToggle = jest.fn();

jest.mock('../hooks/useDarkMode', () => ({
	useDarkMode: () => {
		const [isDark, setIsDark] = useState(false);
		return {
			isDark,
			toggle: () => {
				mockToggle();
				setIsDark((prev) => !prev);
			},
		};
	},
}));

beforeEach(() => {
	mockToggle.mockClear();
});

it('Renders the light mode button', () => {
	render(<DarkModeToggle />);
	const lightBtn = screen.getByRole('button', { name: /toggle light mode/i });
	expect(lightBtn).toBeInTheDocument();
});

it('Renders the dark mode button', () => {
	render(<DarkModeToggle />);
	const darkBtn = screen.getByRole('button', { name: /toggle dark mode/i });
	expect(darkBtn).toBeInTheDocument();
});

it('Light button is pressed and dark button is not pressed when in light mode', () => {
	render(<DarkModeToggle />);
	const darkBtn = screen.getByRole('button', { name: /toggle dark mode/i });
	expect(darkBtn).toHaveAttribute('aria-pressed', 'false');
	const lightBtn = screen.getByRole('button', { name: /toggle light mode/i });
	expect(lightBtn).toHaveAttribute('aria-pressed', 'true');
});

it('Clicks the dark button and triggers toggle when from light mode', async () => {
	render(<DarkModeToggle />);
	const darkBtn = screen.getByRole('button', { name: /toggle dark mode/i });
	await userEvent.click(darkBtn);
	expect(mockToggle).toHaveBeenCalledTimes(1);
});

it('Clicks the light button and does not trigger toggle when already in light mode', async () => {
	render(<DarkModeToggle />);
	const lightBtn = screen.getByRole('button', { name: /toggle light mode/i });
	await userEvent.click(lightBtn);
	expect(mockToggle).not.toHaveBeenCalled();
});

it('Clicks the dark button then the light button and triggers 2 toggles', async () => {
	render(<DarkModeToggle />);
	const darkBtn = screen.getByRole('button', { name: /toggle dark mode/i });
	const lightBtn = screen.getByRole('button', { name: /toggle light mode/i });
	await userEvent.click(darkBtn);
	expect(mockToggle).toHaveBeenCalledTimes(1);
	await userEvent.click(lightBtn);
	expect(mockToggle).toHaveBeenCalledTimes(2);
});
