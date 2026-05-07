import { Icon } from '@iconify/react';
import A from '@/components/elements/A';

const socialLinks = [
	{
		icon: 'akar-icons:github-fill',
		href: 'https://github.com/kafkaesc',
		label: "Jared's GitHub profile",
	},
	{
		icon: 'akar-icons:x-fill',
		href: 'https://x.com/_kafkaesc',
		label: "Jared's X/Twitter profile",
	},
	{
		icon: 'akar-icons:instagram-fill',
		href: 'https://instagram.com/kafkaesc',
		label: "Jared's Instagram profile",
	},
	{
		icon: 'akar-icons:linkedin-box-fill',
		href: 'https://linkedin.com/in/jahettinger',
		label: "Jared's LinkedIn profile",
	},
];

const baseIconLinkStyles =
	'no-underline inline-flex items-center justify-center w-9 h-9 border-b-2 border-transparent hover:border-highlight focus-visible:border-highlight';

const colorModeStyles = {
	light: `${baseIconLinkStyles} text-light hover:bg-dark-hover focus-visible:bg-dark-hover`,
	dark: `${baseIconLinkStyles} text-dark hover:bg-light-hover focus-visible:bg-light-hover`,
} as const;

type ColorMode = keyof typeof colorModeStyles;

interface JhSocialLinksProps {
	colorMode?: ColorMode;
}

/**
 * Renders a row of link icons for the social media profiles for the creator
 *
 * @param colorMode - pass "light" or "dark" to enforce icon color, in order
 * to contrast on different backgrounds
 */
export default function JhSocialLinks({ colorMode }: JhSocialLinksProps) {
	const linkClassName = colorMode
		? colorModeStyles[colorMode]
		: `${baseIconLinkStyles} hover:bg-background-hover focus-visible:bg-background-hover`;

	return (
		<ul className="flex">
			{socialLinks.map(({ icon, href, label }) => (
				<li key={label}>
					<A href={href} aria-label={label} className={linkClassName}>
						<Icon icon={icon} width={24} height={24} />
					</A>
				</li>
			))}
		</ul>
	);
}
