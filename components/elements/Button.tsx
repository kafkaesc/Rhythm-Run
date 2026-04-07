import { cn } from '@/lib/css-utils';

type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
	buttonStyle?: 'black-white' | 'danger' | 'primary' | 'warning';
	mini?: boolean;
};

// Base styles shared across default buttons
const baseStyle =
	'px-3 py-1 rounded-md border-2 border-transparent transition-colors cursor-pointer hover:border-2 disabled:opacity-64 disabled:cursor-not-allowed disabled:hover:border-transparent';

// Styles to render a smaller version of the button
const miniStyle = 'px-2 py-0 text-sm';

// key = buttonStyle, value = corresponding classes for the UI
const styleClasses: Record<string, string> = {
	primary: 'bg-highlight text-dark hover:border-foreground',
	'black-white': 'bg-foreground text-background hover:border-highlight',
	danger: 'bg-danger text-light hover:border-foreground',
	warning: 'bg-warning text-dark hover:border-foreground',
};

export default function Button({
	buttonStyle,
	children,
	className,
	mini,
	...props
}: ButtonProps) {
	const secondaryStyle = styleClasses[buttonStyle ?? 'primary'];
	return (
		<button
			className={cn(baseStyle, mini && miniStyle, secondaryStyle, className)}
			{...props}
		>
			{children}
		</button>
	);
}
