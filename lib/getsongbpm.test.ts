import { fetchGsbTempo } from './getsongbpm';

// Replace the global fetch for testing
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Reset after each test
afterEach(() => {
	mockFetch.mockReset();
});

function mockResponse(ok: boolean, data?: unknown): Response {
	return {
		ok,
		json: () => Promise.resolve(data),
	} as unknown as Response;
}

it('Has fetchGsbTempo return null when the response is not ok', async () => {
	mockFetch.mockResolvedValue(mockResponse(false));
	const result = await fetchGsbTempo('Basket Case', 'Green Day', 'test-key');
	expect(result).toBeNull();
});

it('Has fetchGsbTempo return null when the response JSON is malformed', async () => {
	const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
	mockFetch.mockResolvedValue({
		ok: true,
		json: () => Promise.reject(new Error('Invalid JSON')),
	} as unknown as Response);
	const result = await fetchGsbTempo('Basket Case', 'Green Day', 'test-key');
	expect(result).toBeNull();
	errorSpy.mockRestore();
});

it('Has fetchGsbTempo return null when the search results are missing', async () => {
	mockFetch.mockResolvedValue(mockResponse(true, {}));
	const result = await fetchGsbTempo('Basket Case', 'Green Day', 'test-key');
	expect(result).toBeNull();
});

it('Has fetchGsbTempo return null when the search results are empty', async () => {
	mockFetch.mockResolvedValue(mockResponse(true, { search: [] }));
	const result = await fetchGsbTempo('Basket Case', 'Green Day', 'test-key');
	expect(result).toBeNull();
});

it('Has fetchGsbTempo return null when the tempo is missing from the result', async () => {
	mockFetch.mockResolvedValue(mockResponse(true, { search: [{}] }));
	const result = await fetchGsbTempo('Basket Case', 'Green Day', 'test-key');
	expect(result).toBeNull();
});

it('Has fetchGsbTempo return the tempo as a number when found', async () => {
	mockFetch.mockResolvedValue(
		mockResponse(true, { search: [{ tempo: '128' }] }),
	);
	const result = await fetchGsbTempo('Basket Case', 'Green Day', 'test-key');
	expect(result).toBe(128);
});
