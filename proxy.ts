import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Runs on every page request before it reaches a route handler.
 * Redirects any path containing uppercase characters to its lowercase
 * form with a 308, since Next and Node treat paths case-sensitively.
 *
 * @param request - The incoming Next request
 */
export function proxy(request: NextRequest) {
	const path = request.nextUrl.pathname;

	// Redirect URLs to lowercase, i.e., /Path and /PATH go to /path not 404
	const lowered = path.toLowerCase();
	if (path !== lowered)
		return NextResponse.redirect(new URL(lowered, request.url), 308);
}

// Match every path EXCEPT for the paths starting with
// "api", "_next/static", "_next/image", "favicon.ico", "sitemap.xml", or "robots.txt".
// This ensures we run the proxy on all pages, but not on API routes or static assets.
export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
	],
};
