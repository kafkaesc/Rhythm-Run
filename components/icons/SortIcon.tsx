import { Icon } from '@iconify/react';

type SortIconProps = {
	isSorted: false | 'asc' | 'desc';
};

/**
 * Renders the appropriate sort direction icon for a column header button.
 *
 * @param isSorted - sort state for the column: 'asc', 'desc', or `false` if unsorted
 */
export default function SortIcon({ isSorted }: SortIconProps) {
	if (isSorted === 'asc') {
		return (
			<Icon
				aria-hidden="true"
				height={14}
				icon="lucide:chevron-up"
				width={14}
			/>
		);
	}
	if (isSorted === 'desc') {
		return (
			<Icon
				aria-hidden="true"
				height={14}
				icon="lucide:chevron-down"
				width={14}
			/>
		);
	}
	return (
		<Icon
			aria-hidden="true"
			height={14}
			icon="lucide:chevrons-up-down"
			width={14}
		/>
	);
}
