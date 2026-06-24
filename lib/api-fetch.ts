/**
 * Fetches JSON from an internal API route--meaning the request calls
 * the current origin. Attaches the internal API key header, and throws
 * an error with a labeled message for a non-ok response.
 *
 * @param endpoint - Internal API path, e.g., '/api/lastfm/artist-search'
 * @param params - Query parameters to set on the URL
 * @param signal - AbortSignal for cancellation
 * @param label - API name used in thrown error messages, e.g., 'Last.fm API'
 * @returns The parsed JSON response, typed as T
 */
export async function fetchLocalJson<T>(
	endpoint: string,
	params: Record<string, string>,
	signal: AbortSignal,
	label: string,
): Promise<T> {
	// Build the internal API URL and apply the query parameters
	const url = new URL(endpoint, globalThis.location.origin);
	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, value);
	}

	// Call the internal route with the internal API key
	const res = await fetch(url, {
		headers: { 'x-api-key': process.env.NEXT_PUBLIC_INTERNAL_API_KEY ?? '' },
		signal,
	});

	// Throw an error for any non-ok response
	if (!res.ok) throw new Error(`${label} error: ${res.status}`);

	// Parse and return the JSON payload, typed as T
	return res.json() as Promise<T>;
}
