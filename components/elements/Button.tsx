import { cn } from '@/lib/css-utils';

type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
	buttonStyle?: 'black-white' | 'danger' | 'primary' | 'warning';
};

export default function Button({
	buttonStyle,
	children,
	className,
	...props
}: ButtonProps) {
	if (!buttonStyle || buttonStyle === 'primary') {
		return (
			<button
				className={cn(
					'px-3 py-1 rounded-md bg-highlight text-dark transition-colors cursor-pointer hover:opacity-90',
					className,
				)}
				{...props}
			>
				{children}
			</button>
		);
	}
	if (buttonStyle === 'black-white') {
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
	if (buttonStyle === 'danger') {
		return (
			<button
				className={cn(
					'px-3 py-1 rounded-md bg-danger text-dark transition-colors cursor-pointer hover:opacity-90',
					className,
				)}
				{...props}
			>
				{children}
			</button>
		);
	}
	if (buttonStyle === 'warning') {
		return (
			<button
				className={cn(
					'px-3 py-1 rounded-md bg-warning text-dark transition-colors cursor-pointer hover:opacity-90',
					className,
				)}
				{...props}
			>
				{children}
			</button>
		);
	}
}
