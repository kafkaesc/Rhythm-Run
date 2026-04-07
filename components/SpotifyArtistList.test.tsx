import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SpotifyArtistList from './SpotifyArtistList';
import { BadBunny, DaftPunk, GreenDay } from '@/mocks/SpotifyArtistMocks';

it('Renders nothing when artists is null', () => {
	const { container } = render(<SpotifyArtistList artists={null} />);
	expect(container).toBeEmptyDOMElement();
});

it('Renders nothing when artists is empty', () => {
	const { container } = render(<SpotifyArtistList artists={[]} />);
	expect(container).toBeEmptyDOMElement();
});

it('Renders artist names', () => {
	render(<SpotifyArtistList artists={[BadBunny, DaftPunk, GreenDay]} />);
	const badBunnyRow = screen.getByText('Bad Bunny');
	expect(badBunnyRow).toBeInTheDocument();
	const daftPunkRow = screen.getByText('Daft Punk');
	expect(daftPunkRow).toBeInTheDocument();
	const greenDayRow = screen.getByText('Green Day');
	expect(greenDayRow).toBeInTheDocument();
});

it('Renders an add button for each artist when add function is passed', () => {
	render(<SpotifyArtistList artists={[BadBunny, DaftPunk]} add={jest.fn()} />);
	const badBunnyAddBtn = screen.getByRole('button', { name: /add bad bunny/i });
	expect(badBunnyAddBtn).toBeInTheDocument();
	const daftPunkAddBtn = screen.getByRole('button', { name: /add daft punk/i });
	expect(daftPunkAddBtn).toBeInTheDocument();
});

it('Does not render an add button when add function is not passed', () => {
	render(<SpotifyArtistList artists={[BadBunny, DaftPunk]} />);
	const anyAddBtn = screen.queryByRole('button', { name: /add/i });
	expect(anyAddBtn).not.toBeInTheDocument();
});

it('Calls add with the artist when the add button is clicked', async () => {
	const add = jest.fn();
	render(<SpotifyArtistList artists={[BadBunny]} add={add} />);
	const addBadBunnyBtn = screen.getByRole('button', { name: /add bad bunny/i });
	await userEvent.click(addBadBunnyBtn);
	expect(add).toHaveBeenCalledWith(BadBunny);
});

it('Renders a remove button for each artist when remove function is passed', () => {
	render(
		<SpotifyArtistList artists={[BadBunny, DaftPunk]} remove={jest.fn()} />,
	);
	const rmBadBunnyBtn = screen.getByRole('button', {
		name: /remove bad bunny/i,
	});
	expect(rmBadBunnyBtn).toBeInTheDocument();
	const rmDaftPunkBtn = screen.getByRole('button', {
		name: /remove daft punk/i,
	});
	expect(rmDaftPunkBtn).toBeInTheDocument();
});

it('Calls remove with the artist when the remove button is clicked', async () => {
	const remove = jest.fn();
	render(<SpotifyArtistList artists={[BadBunny]} remove={remove} />);
	const rmBadBunnyBtn = screen.getByRole('button', {
		name: /remove bad bunny/i,
	});
	await userEvent.click(rmBadBunnyBtn);
	expect(remove).toHaveBeenCalledWith(BadBunny);
});
