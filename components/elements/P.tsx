import { cn } from '@/lib/css-utils';

type PProps = React.ComponentPropsWithoutRef<'p'>;

/** A styled paragraph element that accepts all native attributes */
export default function P({ children, className, ...props }: PProps) {
	return (
		<p className={cn('text-base', className)} {...props}>
			{children}
		</p>
	);
}
