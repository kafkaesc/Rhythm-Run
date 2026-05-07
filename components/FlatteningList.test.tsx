import { render, screen } from '@testing-library/react';
import FlatteningList from './FlatteningList';

const twoItems = [
	{ key: '001', node: <span>Bulbasaur</span> },
	{ key: '002', node: <span>Ivysaur</span> },
];

const threeItems = [
	{ key: '001', node: <span>Bulbasaur</span> },
	{ key: '002', node: <span>Ivysaur</span> },
	{ key: '003', node: <span>Venusaur</span> },
];

it('Renders all list item nodes', () => {
	render(<FlatteningList list={twoItems} />);
	const bulbasaur = screen.getByText('Bulbasaur');
	const ivysaur = screen.getByText('Ivysaur');
	expect(bulbasaur).toBeInTheDocument();
	expect(ivysaur).toBeInTheDocument();
});

it('Renders one separator between two items', () => {
	render(<FlatteningList list={twoItems} />);
	const separators = screen.getAllByText('-');
	expect(separators).toHaveLength(1);
});

it('Renders two separators between three items', () => {
	render(<FlatteningList list={threeItems} />);
	const separators = screen.getAllByText('-');
	expect(separators).toHaveLength(2);
});

it('Renders no separator for a single item', () => {
	render(
		<FlatteningList list={[{ key: '001', node: <span>Bulbasaur</span> }]} />,
	);
	const separator = screen.queryByText('-');
	expect(separator).not.toBeInTheDocument();
});

it('Renders a custom separator', () => {
	render(<FlatteningList list={twoItems} separator="//" />);
	const separator = screen.getByText('//');
	expect(separator).toBeInTheDocument();
});

it('Renders an empty list without errors', () => {
	render(<FlatteningList list={[]} />);
	const items = screen.queryAllByRole('listitem');
	expect(items).toHaveLength(0);
});
