import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArtistSearchList from './ArtistSearchList';
import { LfmBadBunny, LfmDaftPunk, LfmGreenDay } from '@/mocks/LfmArtistMocks';

it('Renders nothing when selected is empty and results is null', () => {
	const { container } = render(
		<ArtistSearchList results={null} selected={[]} />,
	);
	expect(container).toBeEmptyDOMElement();
});

it('Renders nothing when selected is empty and results is empty', () => {
	const { container } = render(<ArtistSearchList results={[]} selected={[]} />);
	expect(container).toBeEmptyDOMElement();
});

it('Renders selected artist names', () => {
	render(
		<ArtistSearchList results={null} selected={[LfmBadBunny, LfmDaftPunk]} />,
	);
	const badBunny = screen.getByText('Bad Bunny');
	const daftPunk = screen.getByText('Daft Punk');
	expect(badBunny).toBeInTheDocument();
	expect(daftPunk).toBeInTheDocument();
});

it('Renders result artist names', () => {
	render(<ArtistSearchList results={[LfmGreenDay]} selected={[]} />);
	const greenDay = screen.getByText('Green Day');
	expect(greenDay).toBeInTheDocument();
});

it('Renders a remove button for each selected artist', () => {
	render(
		<ArtistSearchList
			remove={jest.fn()}
			results={null}
			selected={[LfmBadBunny, LfmDaftPunk]}
		/>,
	);
	const removeBadBunny = screen.getByRole('button', {
		name: /remove bad bunny/i,
	});
	const removeDaftPunk = screen.getByRole('button', {
		name: /remove daft punk/i,
	});
	expect(removeBadBunny).toBeInTheDocument();
	expect(removeDaftPunk).toBeInTheDocument();
});

it('Renders an add button for each result artist', () => {
	render(
		<ArtistSearchList add={jest.fn()} results={[LfmGreenDay]} selected={[]} />,
	);
	const addGreenDay = screen.getByRole('button', { name: /add green day/i });
	expect(addGreenDay).toBeInTheDocument();
});

it('Calls remove with the artist when remove button is clicked', async () => {
	const remove = jest.fn();
	render(
		<ArtistSearchList
			remove={remove}
			results={null}
			selected={[LfmBadBunny]}
		/>,
	);
	const removeBtn = screen.getByRole('button', { name: /remove bad bunny/i });
	await userEvent.click(removeBtn);
	expect(remove).toHaveBeenCalledWith(LfmBadBunny);
});

it('Calls add with the artist when add button is clicked', async () => {
	const add = jest.fn();
	render(<ArtistSearchList add={add} results={[LfmGreenDay]} selected={[]} />);
	const addBtn = screen.getByRole('button', { name: /add green day/i });
	await userEvent.click(addBtn);
	expect(add).toHaveBeenCalledWith(LfmGreenDay);
});

it('Filters selected artists out of results', () => {
	render(
		<ArtistSearchList
			add={jest.fn()}
			results={[LfmBadBunny, LfmDaftPunk]}
			selected={[LfmBadBunny]}
		/>,
	);
	const addDaftPunk = screen.getByRole('button', { name: /add daft punk/i });
	const addBadBunny = screen.queryByRole('button', { name: /add bad bunny/i });
	expect(addDaftPunk).toBeInTheDocument();
	expect(addBadBunny).not.toBeInTheDocument();
});

it('Selected artists appear before results', () => {
	render(
		<ArtistSearchList
			add={jest.fn()}
			remove={jest.fn()}
			results={[LfmGreenDay]}
			selected={[LfmBadBunny]}
		/>,
	);
	const items = screen.getAllByRole('button');
	expect(items[0]).toHaveAccessibleName(/remove bad bunny/i);
	expect(items[1]).toHaveAccessibleName(/add green day/i);
});
