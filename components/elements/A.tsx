import Link from 'next/link';
import { cn } from '@/lib/css-utils';

type AProps = React.ComponentPropsWithoutRef<'a'>;

const sharedStyles =
	'text-foreground underline decoration-highlight decoration-[0.1em] transition-colors duration-300 hover:bg-background-hover focus-visible:bg-background-hover';

/** A styled anchor element that accepts all native attributes */
export default function A({ children, className, href, ...props }: AProps) {
	// If there's no href, render a non-link anchor element
	if (!href) {
		return (
			<a className={cn(sharedStyles, className)} {...props}>
				{children}
			</a>
		);
	}

	// Internal links use Next Link for client-side navigation
	if (href.startsWith('/') || href.startsWith('#')) {
		return (
			<Link className={cn(sharedStyles, className)} href={href} {...props}>
				{children}
			</Link>
		);
	}

	// External links use an anchor element and open in a new tab
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
