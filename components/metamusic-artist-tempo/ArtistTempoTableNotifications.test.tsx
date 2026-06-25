import { render, screen } from '@testing-library/react';
import ArtistTempoTableNotifications from './ArtistTempoTableNotifications';

it('Displays a non-breaking space so the row keeps its height when there are no artists', () => {
	const { container } = render(<ArtistTempoTableNotifications />);
	const region = container.querySelector('[aria-live="polite"]');
	expect(region?.textContent).toBe('\u00A0');
});

it('Holds space without a message when noDataArtists is empty', () => {
	render(<ArtistTempoTableNotifications noDataArtists={[]} />);
	const message = screen.queryByText(/no tempo data found/i);
	expect(message).not.toBeInTheDocument();
});

it('Lists a single artist without a separator', () => {
	render(<ArtistTempoTableNotifications noDataArtists={['Shakira']} />);
	const message = screen.getByText(/No tempo data found for Shakira/i);
	expect(message).toBeInTheDocument();
});

it('Joins two artists with "or"', () => {
	render(
		<ArtistTempoTableNotifications noDataArtists={['Rihanna', 'Shakira']} />,
	);
	const message = screen.getByText(
		/No tempo data found for Rihanna or Shakira/i,
	);
	expect(message).toBeInTheDocument();
});

it('Joins three or more artists with commas and "or"', () => {
	render(
		<ArtistTempoTableNotifications
			noDataArtists={['Rihanna', 'Rilo Kiley', 'Shakira']}
		/>,
	);
	const message = screen.getByText(
		/No tempo data found for Rihanna, Rilo Kiley, or Shakira/i,
	);
	expect(message).toBeInTheDocument();
});
