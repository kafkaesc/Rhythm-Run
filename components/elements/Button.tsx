import { cn } from '@/lib/css-utils';

type ButtonProps = React.ComponentPropsWithoutRef<'button'>;

export default function Button({
	// buttonStyle,
	children,
	className,
	...props
}: ButtonProps) {
	return (
		<button
			className={cn(
				'px-3 py-1 rounded-md bg-foreground text-background transition-colors cursor-pointer hover:opacity-90',
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}
