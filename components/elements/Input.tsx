import { cn } from '@/lib/utils';

type InputProps = React.ComponentPropsWithoutRef<'input'>;

export default function Input({ className, ...props }: InputProps) {
	return (
		<input
			className={cn(
				'border border-foreground rounded px-2 py-1 mx-1',
				className,
			)}
			{...props}
		/>
	);
}
