import { cn } from '@/lib/css-utils';

type H2Props = React.ComponentPropsWithoutRef<'h2'>;

/** A styled heading element that accepts all native attributes */
export default function H2({ children, className, ...props }: H2Props) {
	return (
		<h2 className={cn('text-2xl font-bold', className)} {...props}>
			{children}
		</h2>
	);
}
