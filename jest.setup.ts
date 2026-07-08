import '@testing-library/jest-dom';
import { ReadableStream } from 'node:stream/web';
import { TextDecoder, TextEncoder } from 'node:util';

// jsdom does not implement the web streaming/encoding globals, so back them
// with the Node built-ins for code that reads fetch response streams in tests
globalThis.TextEncoder ??= TextEncoder as typeof globalThis.TextEncoder;
globalThis.TextDecoder ??= TextDecoder as typeof globalThis.TextDecoder;
globalThis.ReadableStream ??=
	ReadableStream as typeof globalThis.ReadableStream;

// jsdom does not implement ResizeObserver, add it here so components that
// call new ResizeObserver() don't throw errors in tests
globalThis.ResizeObserver = class ResizeObserver {
	observe() {
		/* no-op: tests don't exercise resize callbacks */
	}
	unobserve() {
		/* no-op */
	}
	disconnect() {
		/* no-op */
	}
};
