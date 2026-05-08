import { render } from '@testing-library/react';
import SortIcon from './SortIcon';

jest.mock('@iconify/react', () => ({
	Icon: ({ icon, ...props }: { icon: string; [key: string]: unknown }) => (
		<span data-icon={icon} {...props} />
	),
}));

it('Renders chevron-up when sorted ascending', () => {
	const { container } = render(<SortIcon isSorted="asc" />);
	const icon = container.querySelector('[data-icon]');
	expect(icon).toHaveAttribute('data-icon', 'lucide:chevron-up');
});

it('Renders chevron-down when sorted descending', () => {
	const { container } = render(<SortIcon isSorted="desc" />);
	const icon = container.querySelector('[data-icon]');
	expect(icon).toHaveAttribute('data-icon', 'lucide:chevron-down');
});

it('Renders chevrons-up-down when unsorted', () => {
	const { container } = render(<SortIcon isSorted={false} />);
	const icon = container.querySelector('[data-icon]');
	expect(icon).toHaveAttribute('data-icon', 'lucide:chevrons-up-down');
});

it('Renders icon as aria-hidden', () => {
	const { container } = render(<SortIcon isSorted={false} />);
	const icon = container.querySelector('[data-icon]');
	expect(icon).toHaveAttribute('aria-hidden', 'true');
});
