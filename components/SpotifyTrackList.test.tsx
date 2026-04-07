import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SpotifyTrackList from './SpotifyTrackList';
import {
	BasketCase,
	FeelGoodInc,
	PortionsForFoxes,
} from '@/mocks/SpotifyTrackMocks';

it('Renders nothing when tracks is null', () => {
	const { container } = render(<SpotifyTrackList tracks={null} />);
	expect(container).toBeEmptyDOMElement();
});

it('Renders nothing when tracks is empty', () => {
	const { container } = render(<SpotifyTrackList tracks={[]} />);
	expect(container).toBeEmptyDOMElement();
});

it('Renders track name and artist', () => {
	render(
		<SpotifyTrackList tracks={[BasketCase, FeelGoodInc, PortionsForFoxes]} />,
	);
	const basketCaseRow = screen.getByText(/"Basket Case" by Green Day/i);
	expect(basketCaseRow).toBeInTheDocument();
	const feelGoodRow = screen.getByText(
		/"Feel Good Inc\." by Gorillaz, De La Soul/i,
	);
	expect(feelGoodRow).toBeInTheDocument();
	const portionsRow = screen.getByText(/"Portions for Foxes" by Rilo Kiley/i);
	expect(portionsRow).toBeInTheDocument();
});

it('Renders an add button for each track when add function is passed', () => {
	render(
		<SpotifyTrackList tracks={[BasketCase, FeelGoodInc]} add={jest.fn()} />,
	);
	const addBasketCaseBtn = screen.getByRole('button', {
		name: /add "basket case" by green day/i,
	});
	expect(addBasketCaseBtn).toBeInTheDocument();
	const addFeelGoodBtn = screen.getByRole('button', {
		name: /add "feel good inc\." by gorillaz/i,
	});
	expect(addFeelGoodBtn).toBeInTheDocument();
});

it('Does not render an add button when add function is not passed', () => {
	render(<SpotifyTrackList tracks={[BasketCase]} />);
	const anyAddBtn = screen.queryByRole('button', { name: /add/i });
	expect(anyAddBtn).not.toBeInTheDocument();
});

it('Calls add with the track when the add button is clicked', async () => {
	const add = jest.fn();
	render(<SpotifyTrackList tracks={[BasketCase]} add={add} />);
	const addBtn = screen.getByRole('button', {
		name: /add "basket case" by green day/i,
	});
	await userEvent.click(addBtn);
	expect(add).toHaveBeenCalledWith(BasketCase);
});

it('Renders a remove button for each track when remove function is passed', () => {
	render(
		<SpotifyTrackList tracks={[BasketCase, FeelGoodInc]} remove={jest.fn()} />,
	);
	const rmBasketCaseBtn = screen.getByRole('button', {
		name: /remove "basket case" by green day/i,
	});
	expect(rmBasketCaseBtn).toBeInTheDocument();
	const rmFeelGoodBtn = screen.getByRole('button', {
		name: /remove "feel good inc\." by gorillaz/i,
	});
	expect(rmFeelGoodBtn).toBeInTheDocument();
});

it('Calls remove with the track when the remove button is clicked', async () => {
	const remove = jest.fn();
	render(<SpotifyTrackList tracks={[BasketCase]} remove={remove} />);
	const rmBtn = screen.getByRole('button', {
		name: /remove "basket case" by green day/i,
	});
	await userEvent.click(rmBtn);
	expect(remove).toHaveBeenCalledWith(BasketCase);
});
