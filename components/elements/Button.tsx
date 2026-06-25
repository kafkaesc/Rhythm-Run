import { cn } from '@/lib/css-utils';

type ButtonProps = Readonly<
	React.ComponentPropsWithoutRef<'button'> & {
		buttonStyle?: 'black-white' | 'danger' | 'primary' | 'text' | 'warning';
		icon?: React.ReactNode;
		mini?: boolean;
	}
>;

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
	text: 'cursor-pointer text-foreground underline decoration-highlight decoration-[0.1em] transition-colors duration-300 hover:bg-background-hover focus-visible:bg-background-hover disabled:opacity-40 disabled:cursor-not-allowed',
	warning: 'bg-warning text-dark hover:border-foreground',
};

/**
 * A styled button element that accepts all native attributes.
 *
 * @param buttonStyle - Indicates what style to render, defaults to 'primary'
 * @param icon - Optional, ReactNode rendered at the start of the button
 * @param mini - Optional, if true renders a more compact button
 */
export default function Button({
	buttonStyle,
	children,
	className,
	icon,
	mini,
	...props
}: ButtonProps) {
	const iconClass = icon ? 'flex items-center gap-1' : undefined;

	if (buttonStyle === 'text') {
		return (
			<button
				className={cn(styleClasses.text, iconClass, className)}
				{...props}
			>
				{icon}
				{children}
			</button>
		);
	}

	const secondaryStyle = styleClasses[buttonStyle ?? 'primary'];
	return (
		<button
			className={cn(
				baseStyle,
				mini && miniStyle,
				secondaryStyle,
				iconClass,
				className,
			)}
			{...props}
		>
			{icon}
			{children}
		</button>
	);
}
