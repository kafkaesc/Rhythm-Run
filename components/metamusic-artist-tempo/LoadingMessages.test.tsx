import { render, screen, act } from '@testing-library/react';
import LoadingMessages from './LoadingMessages';

beforeEach(() => {
	jest.useFakeTimers();
});

afterEach(() => {
	jest.useRealTimers();
});

it('Renders the first loading message on mount', () => {
	render(<LoadingMessages />);
	expect(screen.getByText(/Lacing up/)).toBeInTheDocument();
});

it('Advances to the second message after 2048ms', () => {
	render(<LoadingMessages />);
	act(() => jest.advanceTimersByTime(2048));
	expect(screen.getByText(/Running the track/)).toBeInTheDocument();
});

it('Cycles back to the first message after all four messages have shown', () => {
	render(<LoadingMessages />);
	act(() => jest.advanceTimersByTime(2048 * 4));
	expect(screen.getByText(/Lacing up/)).toBeInTheDocument();
});
