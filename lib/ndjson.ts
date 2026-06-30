/**
 * Parses a single line of an NDJSON stream into a record of type T.
 * Blank lines and malformed JSON are skipped, returning null. Malformed
 * lines are logged so they can be diagnosed without breaking the stream.
 *
 * @param line - A single line from the stream
 * @returns The parsed record typed as T, or null if the line is blank/malformed
 */
export function parseNdjsonLine<T>(line: string): T | null {
	// Blank lines carry no record => skip silently
	if (!line.trim()) return null;

	try {
		return JSON.parse(line) as T;
	} catch {
		// Malformed lines => log and skip
		console.warn('Skipping malformed NDJSON line:', line);
		return null;
	}
}

/**
 * Reads a byte stream of newline-delimited JSON and yields each complete
 * record as it arrives. A partial line at the end of a chunk is buffered
 * until the rest of it streams in.
 *
 * @param stream - The response body stream to read NDJSON from
 * @yields Each parsed record, typed as T, in the order it is received
 */
export async function* readNdjsonStream<T>(
	stream: ReadableStream<Uint8Array>,
): AsyncGenerator<T> {
	const decoder = new TextDecoder();
	const reader = stream.getReader();
	let buffer = '';

	while (true) {
		// Read the next chunk from the stream, stopping when it is exhausted
		const { done, value } = await reader.read();
		if (done) break;

		// Decode the chunk, split on newline, and hold any partial trailing line
		buffer += decoder.decode(value, { stream: true });
		const lines = buffer.split('\n');
		buffer = lines.pop() ?? '';

		// Yield each complete line that parses into a record
		for (const line of lines) {
			const record = parseNdjsonLine<T>(line);
			if (record !== null) yield record;
		}
	}

	// Flush any bytes the decoder held back at a chunk boundary, then
	// yield a final record so a stream whose last line lacks a trailing
	// newline does not silently drop it
	buffer += decoder.decode();
	const record = parseNdjsonLine<T>(buffer);
	if (record !== null) yield record;
}
