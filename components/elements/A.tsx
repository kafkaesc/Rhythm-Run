import Link from 'next/link';
import { cn } from '@/lib/utils';

type AProps = React.ComponentPropsWithoutRef<'a'>;

const sharedStyles =
	'text-foreground underline decoration-highlight decoration-[0.1em] transition-colors duration-300 hover:bg-background-hover focus-visible:bg-background-hover';

export default function A({ children, className, href, ...props }: AProps) {
	if (!href) {
		return (
			<a className={cn(sharedStyles, className)} {...props}>
				{children}
			</a>
		);
	}

	if (href.startsWith('/') || href.startsWith('#')) {
		return (
			<Link className={cn(sharedStyles, className)} href={href} {...props}>
				{children}
			</Link>
		);
	}

	return (
		<a
			className={cn(sharedStyles, className)}
			href={href}
			rel="noopener noreferrer"
			target="_blank"
			{...props}
		>
			{children}
		</a>
	);
}
