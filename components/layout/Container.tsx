import { cn } from '@/lib/css-utils';

type ContainerProps = React.ComponentPropsWithoutRef<'div'>;

export default function Container({
	children,
	className,
	...props
}: ContainerProps) {
	return (
		<div className={cn('mx-auto w-full max-w-4xl px-4', className)} {...props}>
			{children}
		</div>
	);
}
