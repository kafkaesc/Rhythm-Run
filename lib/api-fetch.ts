/**
 * Builds a URL for an internal API route, applying each query parameter.
 * Array values are appended as repeated params, e.g.,
 * `{ artistMbid: ['a', 'b'] }` becomes `?artistMbid=a&artistMbid=b`.
 *
 * @param endpoint - Internal API path, e.g., '/api/lastfm/artist-search'
 * @param params - Query parameters to apply, string or string[] per key
 * @returns The fully built URL
 */
function buildLocalUrl(
	endpoint: string,
	params: Record<string, string | string[]>,
): URL {
	const url = new URL(endpoint, globalThis.location.origin);

	for (const [key, value] of Object.entries(params)) {
		const values = Array.isArray(value) ? value : [value];
		for (const v of values) url.searchParams.append(key, v);
	}
	return url;
}

/**
 * Calls an internal API route on the current origin with the internal API
 * key header, throwing a labeled error for a non-ok response.
 *
 * @param endpoint - Internal API path, e.g., '/api/lastfm/artist-search'
 * @param params - Query parameters to apply to the URL
 * @param signal - AbortSignal for cancellation
 * @param label - API name used in thrown error messages, e.g., 'Last.fm API'
 * @returns The raw response, guaranteed ok
 */
async function fetchLocal(
	endpoint: string,
	params: Record<string, string | string[]>,
	signal: AbortSignal,
	label: string,
): Promise<Response> {
	const url = buildLocalUrl(endpoint, params);

	// Call the internal route with the internal API key, this is a soft gate
	// and not a hardened security measure, but it at least prevents trivial
	// or casual abuse of the internal API routes from outside the app.
	const res = await fetch(url, {
		headers: { 'x-api-key': process.env.NEXT_PUBLIC_INTERNAL_API_KEY ?? '' },
		signal,
	});

	// Throw an error for any non-ok response
	if (!res.ok) throw new Error(`${label} error: ${res.status}`);

	return res;
}

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
	params: Record<string, string | string[]>,
	signal: AbortSignal,
	label: string,
): Promise<T> {
	const res = await fetchLocal(endpoint, params, signal, label);

	// Parse and return the JSON payload, typed as T
	return res.json() as Promise<T>;
}

/**
 * Fetches a streaming response body from an internal API route for routes
 * that emit data progressively, e.g., NDJSON. Attaches the internal API key
 * header, and throws a labeled error for a non-ok or bodyless response.
 *
 * @param endpoint - Internal API path, e.g., '/api/metamusic/artist-tracks'
 * @param params - Query parameters to apply to the URL
 * @param signal - AbortSignal for cancellation
 * @param label - API name used in thrown error messages, e.g., 'MetaMusic API'
 * @returns The response body stream
 */
export async function fetchLocalStream(
	endpoint: string,
	params: Record<string, string | string[]>,
	signal: AbortSignal,
	label: string,
): Promise<ReadableStream<Uint8Array>> {
	const res = await fetchLocal(endpoint, params, signal, label);

	// A streaming route with no body cannot be read
	if (!res.body) throw new Error(`${label} returned no response body`);

	return res.body;
}
