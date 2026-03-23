import { cn } from '@/lib/css-utils';

type InputProps = React.ComponentPropsWithoutRef<'input'>;

/** A styled text input that accepts all native attributes */
export default function Input({ className, ...props }: InputProps) {
	return (
		<input
			className={cn('border border-foreground rounded px-2 py-1', className)}
			{...props}
		/>
	);
}
