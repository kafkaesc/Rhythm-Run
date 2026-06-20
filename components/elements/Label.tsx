import { cn } from '@/lib/css-utils';

type LabelProps = Readonly<React.ComponentPropsWithoutRef<'label'>>;

/** A styled label element that accepts all native attributes */
export default function Label({ children, className, ...props }: LabelProps) {
	return (
		<label
			className={cn('text-xl font-bold md:text-2xl', className)}
			{...props}
		>
			{children}
		</label>
	);
}
