import { Fragment } from 'react';
import { cn } from '@/lib/css-utils';
import { ReactNodeAndKey } from '@/models/rhythmRun';

type FlatteningListProps = {
	list: ReactNodeAndKey[];
	className?: string;
	separator?: string;
};

export default function FlatteningList({
	list,
	className,
	separator = '-',
}: FlatteningListProps) {
	return (
		<ul
			className={cn(
				'flex flex-col sm:flex-row sm:items-center sm:gap-2',
				className,
			)}
		>
			{list.map(({ key, node }, i) => (
				<Fragment key={key}>
					<li>{node}</li>
					{i < list.length - 1 && (
						<li aria-hidden className="hidden sm:block font-bold">
							{separator}
						</li>
					)}
				</Fragment>
			))}
		</ul>
	);
}
