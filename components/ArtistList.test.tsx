import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArtistList from './ArtistList';
import { SpBadBunny, SpDaftPunk, SpGreenDay } from '@/mocks/SpotifyArtistMocks';
import { normalizeSpotifyArtist } from '@/lib/normalize';

it('Renders nothing when artists is null', () => {
	const { container } = render(
		<ArtistList toArtist={normalizeSpotifyArtist} artists={null} />,
	);
	expect(container).toBeEmptyDOMElement();
});

it('Renders nothing when artists is empty', () => {
	const { container } = render(
		<ArtistList toArtist={normalizeSpotifyArtist} artists={[]} />,
	);
	expect(container).toBeEmptyDOMElement();
});

it('Renders artist names', () => {
	render(
		<ArtistList
			toArtist={normalizeSpotifyArtist}
			artists={[SpBadBunny, SpDaftPunk, SpGreenDay]}
		/>,
	);
	const badBunnyRow = screen.getByText('Bad Bunny');
	const daftPunkRow = screen.getByText('Daft Punk');
	const greenDayRow = screen.getByText('Green Day');
	expect(badBunnyRow).toBeInTheDocument();
	expect(daftPunkRow).toBeInTheDocument();
	expect(greenDayRow).toBeInTheDocument();
});

it('Renders an add button for each artist when add function is passed', () => {
	render(
		<ArtistList
			add={jest.fn()}
			toArtist={normalizeSpotifyArtist}
			artists={[SpBadBunny, SpDaftPunk]}
		/>,
	);
	const addBadBunnyBtn = screen.getByRole('button', {
		name: /add bad bunny/i,
	});
	const addDaftPunkBtn = screen.getByRole('button', {
		name: /add daft punk/i,
	});
	expect(addBadBunnyBtn).toBeInTheDocument();
	expect(addDaftPunkBtn).toBeInTheDocument();
});

it('Does not render an add button when add function is not passed', () => {
	render(
		<ArtistList toArtist={normalizeSpotifyArtist} artists={[SpBadBunny]} />,
	);
	const anyAddBtn = screen.queryByRole('button', { name: /add/i });
	expect(anyAddBtn).not.toBeInTheDocument();
});

it('Calls add with the artist when the add button is clicked', async () => {
	const add = jest.fn();
	render(
		<ArtistList
			add={add}
			toArtist={normalizeSpotifyArtist}
			artists={[SpBadBunny]}
		/>,
	);
	const addBadBunnyBtn = screen.getByRole('button', { name: /add bad bunny/i });
	await userEvent.click(addBadBunnyBtn);
	expect(add).toHaveBeenCalledWith(SpBadBunny);
});

it('Renders a remove button for each artist when remove function is passed', () => {
	render(
		<ArtistList
			remove={jest.fn()}
			toArtist={normalizeSpotifyArtist}
			artists={[SpBadBunny, SpDaftPunk]}
		/>,
	);
	const rmBadBunnyBtn = screen.getByRole('button', {
		name: /remove bad bunny/i,
	});
	const rmDaftPunkBtn = screen.getByRole('button', {
		name: /remove daft punk/i,
	});
	expect(rmBadBunnyBtn).toBeInTheDocument();
	expect(rmDaftPunkBtn).toBeInTheDocument();
});

it('Calls remove with the artist when the remove button is clicked', async () => {
	const remove = jest.fn();
	render(
		<ArtistList
			remove={remove}
			toArtist={normalizeSpotifyArtist}
			artists={[SpBadBunny]}
		/>,
	);
	const rmBadBunnyBtn = screen.getByRole('button', {
		name: /remove bad bunny/i,
	});
	await userEvent.click(rmBadBunnyBtn);
	expect(remove).toHaveBeenCalledWith(SpBadBunny);
});
