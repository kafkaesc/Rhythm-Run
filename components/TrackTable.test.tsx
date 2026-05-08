import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TrackTable from './TrackTable';
import { Track } from '@/models/rhythmRun';

const basketCase: Track = {
	artists: ['Green Day'],
	bpm: 172,
	id: '2001',
	title: 'Basket Case',
};

const feelGoodInc: Track = {
	artists: ['Gorillaz'],
	bpm: 138,
	id: '2002',
	title: 'Feel Good Inc.',
};

const portionsForFoxes: Track = {
	artists: ['Rilo Kiley'],
	id: '2003',
	title: 'Portions for Foxes',
};

function makeTracks(count: number): Track[] {
	return Array.from({ length: count }, (_, i) => ({
		id: String(i + 1),
		title: `Track ${i + 1}`,
		artists: [`Artist ${i + 1}`],
		bpm: 100 + i,
	}));
}

it('Renders column headers', () => {
	render(<TrackTable tracks={[basketCase]} />);
	const titleHeader = screen.getByRole('columnheader', { name: /title/i });
	const artistsHeader = screen.getByRole('columnheader', { name: /artists/i });
	const bpmHeader = screen.getByRole('columnheader', { name: /bpm/i });
	expect(titleHeader).toBeInTheDocument();
	expect(artistsHeader).toBeInTheDocument();
	expect(bpmHeader).toBeInTheDocument();
});

it('Renders track data', () => {
	render(<TrackTable tracks={[basketCase, feelGoodInc]} />);
	const basketCaseRow = screen.getByRole('row', { name: /basket case/i });
	const feelGoodRow = screen.getByRole('row', { name: /feel good inc/i });
	expect(basketCaseRow).toBeInTheDocument();
	expect(feelGoodRow).toBeInTheDocument();
});

it('Renders artists joined by comma', () => {
	const multiArtist: Track = {
		id: '4',
		title: 'Numb / Encore',
		artists: ['Linkin Park', 'Jay-Z'],
		bpm: 107,
	};
	render(<TrackTable tracks={[multiArtist]} />);
	const cell = screen.getByText('Linkin Park, Jay-Z');
	expect(cell).toBeInTheDocument();
});

it('Shows em dash when bpm is undefined', () => {
	render(<TrackTable tracks={[portionsForFoxes]} />);
	const row = screen.getByRole('row', { name: /portions for foxes/i });
	const bpmCell = within(row).getByText('—');
	expect(bpmCell).toBeInTheDocument();
});

it('Sorts by title ascending then descending on header click', async () => {
	render(<TrackTable tracks={[feelGoodInc, basketCase]} />);
	const titleBtn = screen.getByRole('button', { name: /title/i });

	await userEvent.click(titleBtn);
	const rowsAsc = screen.getAllByRole('row').slice(1);
	expect(rowsAsc[0]).toHaveTextContent('Basket Case');
	expect(rowsAsc[1]).toHaveTextContent('Feel Good Inc.');

	await userEvent.click(titleBtn);
	const rowsDesc = screen.getAllByRole('row').slice(1);
	expect(rowsDesc[0]).toHaveTextContent('Feel Good Inc.');
	expect(rowsDesc[1]).toHaveTextContent('Basket Case');
});

it('Sorts by artists descending then ascending on header click', async () => {
	render(<TrackTable tracks={[feelGoodInc, basketCase]} />);
	const artistsBtn = screen.getByRole('button', { name: /artists/i });

	await userEvent.click(artistsBtn);
	const rowsDesc = screen.getAllByRole('row').slice(1);
	expect(rowsDesc[0]).toHaveTextContent('Green Day');
	expect(rowsDesc[1]).toHaveTextContent('Gorillaz');

	await userEvent.click(artistsBtn);
	const rowsAsc = screen.getAllByRole('row').slice(1);
	expect(rowsAsc[0]).toHaveTextContent('Gorillaz');
	expect(rowsAsc[1]).toHaveTextContent('Green Day');
});

it('Sorts by bpm descending then ascending on header click', async () => {
	render(<TrackTable tracks={[feelGoodInc, basketCase]} />);
	const bpmBtn = screen.getByRole('button', { name: /bpm/i });

	await userEvent.click(bpmBtn);
	const rowsDesc = screen.getAllByRole('row').slice(1);
	expect(rowsDesc[0]).toHaveTextContent('172');
	expect(rowsDesc[1]).toHaveTextContent('138');

	await userEvent.click(bpmBtn);
	const rowsAsc = screen.getAllByRole('row').slice(1);
	expect(rowsAsc[0]).toHaveTextContent('138');
	expect(rowsAsc[1]).toHaveTextContent('172');
});

it('Does not render pagination controls when tracks fit on one page', () => {
	render(<TrackTable tracks={makeTracks(5)} />);
	const prevBtn = screen.queryByRole('button', { name: /previous/i });
	const nextBtn = screen.queryByRole('button', { name: /next/i });
	expect(prevBtn).not.toBeInTheDocument();
	expect(nextBtn).not.toBeInTheDocument();
});

it('Renders pagination controls when tracks exceed one page', () => {
	render(<TrackTable tracks={makeTracks(6)} />);
	const prevBtn = screen.getByRole('button', { name: /previous/i });
	const nextBtn = screen.getByRole('button', { name: /next/i });
	expect(prevBtn).toBeInTheDocument();
	expect(nextBtn).toBeInTheDocument();
});

it('Shows only 5 rows on the first page', () => {
	render(<TrackTable tracks={makeTracks(8)} />);
	const dataRows = screen.getAllByRole('row').slice(1);
	expect(dataRows).toHaveLength(5);
});

it('Previous button is disabled on the first page', () => {
	render(<TrackTable tracks={makeTracks(6)} />);
	const prevBtn = screen.getByRole('button', { name: /previous/i });
	expect(prevBtn).toBeDisabled();
});

it('Next button is disabled on the last page', async () => {
	render(<TrackTable tracks={makeTracks(6)} />);
	const nextBtn = screen.getByRole('button', { name: /next/i });
	await userEvent.click(nextBtn);
	expect(nextBtn).toBeDisabled();
});

it('Next navigates to page 2 and shows remaining rows', async () => {
	render(<TrackTable tracks={makeTracks(8)} />);
	const nextBtn = screen.getByRole('button', { name: /next/i });
	await userEvent.click(nextBtn);
	const dataRows = screen.getAllByRole('row').slice(1);
	expect(dataRows).toHaveLength(3);
});

it('Previous navigates back to page 1', async () => {
	render(<TrackTable tracks={makeTracks(8)} />);
	const nextBtn = screen.getByRole('button', { name: /next/i });
	await userEvent.click(nextBtn);
	const prevBtn = screen.getByRole('button', { name: /previous/i });
	await userEvent.click(prevBtn);
	const dataRows = screen.getAllByRole('row').slice(1);
	expect(dataRows).toHaveLength(5);
});

it('Shows correct row range label', () => {
	render(<TrackTable tracks={makeTracks(8)} />);
	const rangeLabel = screen.getByText('1\u20135 of 8');
	expect(rangeLabel).toBeInTheDocument();
});

it('Sorting resets to page 1', async () => {
	render(<TrackTable tracks={makeTracks(8)} />);
	const nextBtn = screen.getByRole('button', { name: /next/i });
	await userEvent.click(nextBtn);
	expect(screen.getByText('6\u20138 of 8')).toBeInTheDocument();

	const titleBtn = screen.getByRole('button', { name: /title/i });
	await userEvent.click(titleBtn);
	expect(screen.getByText('1\u20135 of 8')).toBeInTheDocument();
});
