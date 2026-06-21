import { fetchGsbTempo } from './getsongbpm';

// Replace the global fetch for testing
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Reset after each test
afterEach(() => {
	mockFetch.mockReset();
});

function mockResponse(
	ok: boolean,
	data?: unknown,
	body = '',
	status = 200,
): Response {
	return {
		ok,
		status,
		json: () => Promise.resolve(data),
		text: () => Promise.resolve(body),
	} as unknown as Response;
}

it('Has fetchGsbTempo return null when the response is not ok', async () => {
	const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
	mockFetch.mockResolvedValue(
		mockResponse(false, undefined, 'Service Unavailable', 503),
	);
	const result = await fetchGsbTempo('Basket Case', 'Green Day', 'test-key');
	expect(result).toBeNull();
	expect(warnSpy).toHaveBeenCalledWith(
		'fetchGsbTempo failed:',
		503,
		'Service Unavailable',
		{ title: 'Basket Case', artist: 'Green Day' },
	);
	warnSpy.mockRestore();
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
