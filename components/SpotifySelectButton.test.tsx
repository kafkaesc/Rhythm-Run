import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SpotifySelectButton from './SpotifySelectButton';

it('Renders with aria-pressed false when not marked', () => {
	render(<SpotifySelectButton marked={false} onClick={jest.fn()} title="Basket Case" />);
	const btn = screen.getByRole('button');
	expect(btn).toHaveAttribute('aria-pressed', 'false');
});

it('Renders with aria-pressed true when marked', () => {
	render(<SpotifySelectButton marked={true} onClick={jest.fn()} title="Basket Case" />);
	const btn = screen.getByRole('button');
	expect(btn).toHaveAttribute('aria-pressed', 'true');
});

it('Has an Add aria-label when not marked', () => {
	render(<SpotifySelectButton marked={false} onClick={jest.fn()} title="Basket Case" />);
	const btn = screen.getByRole('button', { name: /add basket case to spotify/i });
	expect(btn).toBeInTheDocument();
});

it('Has a Remove aria-label when marked', () => {
	render(<SpotifySelectButton marked={true} onClick={jest.fn()} title="Basket Case" />);
	const btn = screen.getByRole('button', { name: /remove basket case from spotify/i });
	expect(btn).toBeInTheDocument();
});

it('Calls onClick when clicked', async () => {
	const onClick = jest.fn();
	render(<SpotifySelectButton marked={false} onClick={onClick} title="Basket Case" />);
	const btn = screen.getByRole('button');
	await userEvent.click(btn);
	expect(onClick).toHaveBeenCalledTimes(1);
});
