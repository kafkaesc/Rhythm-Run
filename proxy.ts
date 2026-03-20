import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Runs on every incoming request before it reaches a route handler.
export function proxy(request: NextRequest) {
	const path = request.nextUrl.pathname;

	// Redirects any request with uppercase characters in the path to lowercase.
	// Next and Node are case-sensitive and AWS Amplify does not normalize casing--so
	// /Path and /PATH would 404.
	const lowered = path.toLowerCase();
	if (path !== lowered)
		return NextResponse.redirect(new URL(lowered, request.url), 308);
}

// Match every path EXCEPT for the paths starting with
// "api", "_next/static", "_next/image", "favicon.ico", "sitemap.xml", or "robots.txt".
// This is ensures we run the proxy on all pages, but not on API routes or static assets.
export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
	],
};
