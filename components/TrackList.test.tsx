import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TrackList from './TrackList';
import {
	SpBasketCase,
	SpFeelGoodInc,
	SpPortionsForFoxes,
} from '@/mocks/SpotifyTrackMocks';
import { normalizeSpotifyTrack } from '@/lib/normalize';

it('Renders nothing when tracks is null', () => {
	const { container } = render(
		<TrackList toTrack={normalizeSpotifyTrack} tracks={null} />,
	);
	expect(container).toBeEmptyDOMElement();
});

it('Renders nothing when tracks is empty', () => {
	const { container } = render(
		<TrackList toTrack={normalizeSpotifyTrack} tracks={[]} />,
	);
	expect(container).toBeEmptyDOMElement();
});

it('Renders track name and artist', () => {
	render(
		<TrackList
			toTrack={normalizeSpotifyTrack}
			tracks={[SpBasketCase, SpFeelGoodInc, SpPortionsForFoxes]}
		/>,
	);
	const basketCaseRow = screen.getByText(/"Basket Case" by Green Day/i);
	const feelGoodRow = screen.getByText(/"Feel Good Inc\."/i);
	const portionsRow = screen.getByText(/"Portions for Foxes" by Rilo Kiley/i);
	expect(basketCaseRow).toBeInTheDocument();
	expect(feelGoodRow).toBeInTheDocument();
	expect(portionsRow).toBeInTheDocument();
});

it('Renders an add button for each track when add function is passed', () => {
	render(
		<TrackList
			add={jest.fn()}
			toTrack={normalizeSpotifyTrack}
			tracks={[SpBasketCase, SpFeelGoodInc]}
		/>,
	);
	const addBasketCaseBtn = screen.getByRole('button', {
		name: /add "basket case"/i,
	});
	const addFeelGoodBtn = screen.getByRole('button', {
		name: /add "feel good inc\."/i,
	});
	expect(addBasketCaseBtn).toBeInTheDocument();
	expect(addFeelGoodBtn).toBeInTheDocument();
});

it('Does not render an add button when add function is not passed', () => {
	render(<TrackList toTrack={normalizeSpotifyTrack} tracks={[SpBasketCase]} />);
	const anyAddBtn = screen.queryByRole('button', { name: /add/i });
	expect(anyAddBtn).not.toBeInTheDocument();
});

it('Calls add with the track when the add button is clicked', async () => {
	const add = jest.fn();
	render(
		<TrackList
			add={add}
			toTrack={normalizeSpotifyTrack}
			tracks={[SpBasketCase]}
		/>,
	);
	const addBtn = screen.getByRole('button', { name: /add "basket case"/i });
	await userEvent.click(addBtn);
	expect(add).toHaveBeenCalledWith(SpBasketCase);
});

it('Renders a remove button for each track when remove function is passed', () => {
	render(
		<TrackList
			remove={jest.fn()}
			toTrack={normalizeSpotifyTrack}
			tracks={[SpBasketCase, SpFeelGoodInc]}
		/>,
	);
	const rmBasketCaseBtn = screen.getByRole('button', {
		name: /remove "basket case"/i,
	});
	const rmFeelGoodBtn = screen.getByRole('button', {
		name: /remove "feel good inc\."/i,
	});
	expect(rmBasketCaseBtn).toBeInTheDocument();
	expect(rmFeelGoodBtn).toBeInTheDocument();
});

it('Calls remove with the track when the remove button is clicked', async () => {
	const remove = jest.fn();
	render(
		<TrackList
			remove={remove}
			toTrack={normalizeSpotifyTrack}
			tracks={[SpBasketCase]}
		/>,
	);
	const rmBtn = screen.getByRole('button', { name: /remove "basket case"/i });
	await userEvent.click(rmBtn);
	expect(remove).toHaveBeenCalledWith(SpBasketCase);
});
