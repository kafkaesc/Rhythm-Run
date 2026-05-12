import { cn } from '@/lib/css-utils';

type H1Props = React.ComponentPropsWithoutRef<'h1'>;

/** A styled heading element that accepts all native attributes */
export default function H1({ children, className, ...props }: H1Props) {
	return (
		<h1 className={cn('text-3xl font-bold md:text-4xl', className)} {...props}>
			{children}
		</h1>
	);
}
