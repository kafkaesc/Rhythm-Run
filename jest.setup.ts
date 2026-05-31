import '@testing-library/jest-dom';

// jsdom does not implement ResizeObserver, add it here so components that
// call new ResizeObserver() don't throw errors in tests
global.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
};
