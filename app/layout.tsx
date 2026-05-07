import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Container from '@/components/layout/Container';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/navigation/Navbar';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Rhythm Run',
	description: 'Find tracks to match your pace. Built by Jared Hettinger',
};

type RootLayoutProps = Readonly<{
	children: React.ReactNode;
}>;

const themeScript = `const theme = localStorage.getItem('tr-theme'); if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) { document.documentElement.classList.add('dark'); }`;

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		/* suppressHydrationWarning is required on <html> because the inline script
			adds the 'dark' class before React hydrates, causing a mismatch between the 
			SSR HTML (no class) and the client DOM (class="dark"). This prop tells React
			to  ignore attribute differences on this element only--it does not ignore
			in children. */
		<html lang="en" suppressHydrationWarning>
			<head>
				{/* dangerouslySetInnerHTML must be a hardcoded string for safety,
				its usage here is justified to prevent a flash of incorrect theme 
				on initial load before the page has hydrated */}
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
			>
				<Container className="grow">
					<Navbar />
					{children}
				</Container>
				<Footer />
			</body>
		</html>
	);
}
