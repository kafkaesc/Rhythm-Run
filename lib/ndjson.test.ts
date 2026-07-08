import { parseNdjsonLine, readNdjsonStream } from './ndjson';

// Builds a readable byte stream from string chunks,
// same as a fetch body would emit
function streamFrom(chunks: string[]): ReadableStream<Uint8Array> {
	const encoder = new TextEncoder();
	return new ReadableStream<Uint8Array>({
		start(controller) {
			for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
			controller.close();
		},
	});
}

// Collects every record an async generator yields into an array
async function collect<T>(gen: AsyncGenerator<T>): Promise<T[]> {
	const out: T[] = [];
	for await (const item of gen) out.push(item);
	return out;
}

it('Has parseNdjsonLine parse a valid JSON line into a record', () => {
	const record = parseNdjsonLine<{ a: number }>('{"a":1}');
	expect(record).toEqual({ a: 1 });
});

it('Has parseNdjsonLine return null for a blank line', () => {
	const record = parseNdjsonLine('   ');
	expect(record).toBeNull();
});

it('Has parseNdjsonLine return null and warn for a malformed line', () => {
	const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
	const record = parseNdjsonLine('{{Jason not json');
	expect(record).toBeNull();
	expect(warnSpy).toHaveBeenCalledWith(
		'Skipping malformed NDJSON line:',
		'{{Jason not json',
	);
	warnSpy.mockRestore();
});

it('Has readNdjsonStream yield each complete record in order', async () => {
	const stream = streamFrom(['{"a":1}\n{"a":2}\n{"a":3}\n']);
	const records = await collect(readNdjsonStream<{ a: number }>(stream));
	expect(records).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);
});

it('Has readNdjsonStream reassemble a record split across chunks', async () => {
	const stream = streamFrom(['{"a":', '1}\n{"a":2}\n']);
	const records = await collect(readNdjsonStream<{ a: number }>(stream));
	expect(records).toEqual([{ a: 1 }, { a: 2 }]);
});

it('Has readNdjsonStream skip blank lines and yield the rest', async () => {
	const stream = streamFrom(['{"a":1}\n\n{"a":2}\n']);
	const records = await collect(readNdjsonStream<{ a: number }>(stream));
	expect(records).toEqual([{ a: 1 }, { a: 2 }]);
});

it('Has readNdjsonStream skip a malformed line and yield the rest', async () => {
	const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
	const stream = streamFrom(['{"a":1}\n{{Jason not json\n{"a":2}\n']);
	const records = await collect(readNdjsonStream<{ a: number }>(stream));
	expect(records).toEqual([{ a: 1 }, { a: 2 }]);
	warnSpy.mockRestore();
});

it('Has readNdjsonStream flush a trailing line without a newline', async () => {
	const stream = streamFrom(['{"a":1}\n{"a":2}']);
	const records = await collect(readNdjsonStream<{ a: number }>(stream));
	expect(records).toEqual([{ a: 1 }, { a: 2 }]);
});

it('Has readNdjsonStream reassemble a multibyte char split across chunks', async () => {
	// 'ñ' is two UTF-8 bytes (c3 b1) at indices 6-7; cut between them so the
	// lead byte lands in the first chunk and the continuation in the second
	const encoder = new TextEncoder();
	const bytes = encoder.encode('{"a":"ñ"}\n');
	const stream = new ReadableStream<Uint8Array>({
		start(controller) {
			controller.enqueue(bytes.slice(0, 7));
			controller.enqueue(bytes.slice(7));
			controller.close();
		},
	});
	const records = await collect(readNdjsonStream<{ a: string }>(stream));
	expect(records).toEqual([{ a: 'ñ' }]);
});
