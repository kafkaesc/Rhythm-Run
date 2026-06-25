import '@testing-library/jest-dom';

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
