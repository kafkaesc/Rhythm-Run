'use client';

import { useState } from 'react';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	PaginationState,
	RowData,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import Button from '@/components/elements/Button';
import SortIcon from '@/components/icons/SortIcon';
import { cn } from '@/lib/css-utils';
import { Track } from '@/models/rhythmRun';

// Extends TanStack Table's ColumnMeta type to support a
// per-column className for th/td CSS
declare module '@tanstack/react-table' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface ColumnMeta<TData extends RowData, TValue> {
		className?: string;
	}
}
/** Binds the TanStack Table ColumnHelper to the Track type */
const columnHelper = createColumnHelper<Track>();

/** Column definitions: Track title, artist, and BPM */
const columns = [
	columnHelper.accessor('title', {
		cell: (info) => info.getValue(),
		header: 'Title',
	}),
	columnHelper.accessor('artists', {
		cell: (info) => info.getValue().join(', '),
		header: 'Artists',
		sortingFn: (a, b) =>
			a.original.artists
				.join(', ')
				.localeCompare(b.original.artists.join(', ')),
	}),
	columnHelper.accessor('bpm', {
		cell: (info) => info.getValue() ?? '—',
		header: 'BPM',
		meta: { className: 'w-px whitespace-nowrap' },
	}),
];

const PAGE_SIZE = 5;

/**
 * Maps TanStack sort state to the HTML aria-sort attribute value for a column header
 *
 * @param isSorted - sort state for the column: 'asc', 'desc', or `false` if unsorted
 * @param canSort - whether the column supports sorting
 */
function getAriaSortValue(
	isSorted: false | 'asc' | 'desc',
	canSort: boolean,
): 'ascending' | 'descending' | 'none' | undefined {
	if (isSorted === 'asc') return 'ascending';
	if (isSorted === 'desc') return 'descending';
	if (canSort) return 'none';
	return undefined;
}

type TrackTableProps = {
	tracks: Track[];
};

/**
 * Displays a paginated, sortable table of tracks
 * with Title, Artists, and BPM columns.
 *
 * @param tracks - an array of {@link Track} objects to display
 */
export default function TrackTable({ tracks }: TrackTableProps) {
	'use no memo';

	const [sorting, setSorting] = useState<SortingState>([]);
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: PAGE_SIZE,
	});

	// eslint-disable-next-line react-hooks/incompatible-library
	const table = useReactTable({
		autoResetPageIndex: false,
		columns,
		data: tracks,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onPaginationChange: setPagination,
		onSortingChange: (updater) => {
			setSorting(updater);
			setPagination((p) => ({ ...p, pageIndex: 0 }));
		},
		state: { sorting, pagination },
	});

	const { pageIndex, pageSize } = table.getState().pagination;
	const totalRows = table.getFilteredRowModel().rows.length;
	const firstRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
	const lastRow = Math.min((pageIndex + 1) * pageSize, totalRows);

	return (
		<div className="pb-4">
			<div className="min-h-64">
				<table className="w-full text-left border-collapse">
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id} className="border-b-2 border-foreground">
								{headerGroup.headers.map((header) => (
									<th
										key={header.id}
										aria-sort={getAriaSortValue(
											header.column.getIsSorted(),
											header.column.getCanSort(),
										)}
										className={cn(
											'py-2 pr-4 font-semibold',
											header.column.columnDef.meta?.className,
										)}
										scope="col"
									>
										{header.isPlaceholder ? null : (
											<button
												className={cn(
													'flex items-center gap-1',
													header.column.getCanSort() &&
														'cursor-pointer select-none',
												)}
												onClick={header.column.getToggleSortingHandler()}
												type="button"
											>
												{flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
												<SortIcon isSorted={header.column.getIsSorted()} />
											</button>
										)}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row) => (
							<tr key={row.id} className="border-b border-foreground-hover">
								{row.getVisibleCells().map((cell) => (
									<td
										key={cell.id}
										className={cn(
											'py-1.5 pr-4',
											cell.column.columnDef.meta?.className,
										)}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
						{table.getRowModel().rows.length === 0 && (
							<tr>
								<td className="py-1.5 text-center" colSpan={columns.length}>
									No matching tracks
								</td>
							</tr>
						)}
					</tbody>
				</table>
				{table.getPageCount() > 1 && (
					<div className="flex items-center justify-between pt-2">
						<span className="text-sm">
							{firstRow}
							{'\u2013'}
							{lastRow} of {totalRows}
						</span>
						<div className="flex gap-2">
							<Button
								buttonStyle="black-white"
								disabled={!table.getCanPreviousPage()}
								mini
								onClick={() => table.previousPage()}
								type="button"
							>
								Previous
							</Button>
							<Button
								buttonStyle="black-white"
								disabled={!table.getCanNextPage()}
								mini
								onClick={() => table.nextPage()}
								type="button"
							>
								Next
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
