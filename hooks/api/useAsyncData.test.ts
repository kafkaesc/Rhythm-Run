import { renderHook, waitFor } from '@testing-library/react';
import { useAsyncData } from './useAsyncData';

function makeFetcher() {
	return jest.fn<Promise<string>, [AbortSignal]>();
}

it('Returns null data and not loading when the fetcher is null', () => {
	const { result } = renderHook(() => useAsyncData<string>(null, []));
	expect(result.current.data).toBeNull();
	expect(result.current.loading).toBe(false);
	expect(result.current.error).toBeNull();
});

it('Returns loading true while the fetch is in flight', () => {
	const fetcher = makeFetcher().mockReturnValue(new Promise(() => {}));
	const { result } = renderHook(() => useAsyncData(fetcher, ['a']));
	expect(result.current.loading).toBe(true);
});

it('Returns the resolved data on a successful fetch', async () => {
	const fetcher = makeFetcher().mockResolvedValue('done');
	const { result } = renderHook(() => useAsyncData(fetcher, ['a']));
	await waitFor(() => expect(result.current.loading).toBe(false));

	expect(result.current.data).toBe('done');
	expect(result.current.error).toBeNull();
});

it('Returns the error message when the fetch rejects with an Error', async () => {
	const fetcher = makeFetcher().mockRejectedValue(new Error('boom'));
	const { result } = renderHook(() => useAsyncData(fetcher, ['a']));
	await waitFor(() => expect(result.current.error).toBe('boom'));

	expect(result.current.data).toBeNull();
});

it('Returns an Unknown error when the fetch rejects with a non-Error', async () => {
	const fetcher = makeFetcher().mockRejectedValue('network blip');
	const { result } = renderHook(() => useAsyncData(fetcher, ['a']));
	await waitFor(() => expect(result.current.error).toBe('Unknown error'));

	expect(result.current.data).toBeNull();
});

it('Ignores AbortError rejections and does not set an error', async () => {
	const abortError = new Error('aborted');
	abortError.name = 'AbortError';
	const fetcher = makeFetcher().mockRejectedValue(abortError);
	const { result } = renderHook(() => useAsyncData(fetcher, ['a']));

	await waitFor(() => expect(fetcher).toHaveBeenCalled());
	expect(result.current.error).toBeNull();
	expect(result.current.data).toBeNull();
});

it('Passes an abort signal to the fetcher', () => {
	const fetcher = makeFetcher().mockReturnValue(new Promise(() => {}));
	renderHook(() => useAsyncData(fetcher, ['a']));
	const signal = fetcher.mock.calls[0][0];
	expect(signal).toBeInstanceOf(AbortSignal);
});

it('Aborts the in-flight request when deps change', () => {
	const fetcher = makeFetcher().mockReturnValue(new Promise(() => {}));
	const { rerender } = renderHook(({ dep }) => useAsyncData(fetcher, [dep]), {
		initialProps: { dep: 'a' },
	});
	const firstSignal = fetcher.mock.calls[0][0];
	expect(firstSignal.aborted).toBe(false);

	rerender({ dep: 'b' });
	expect(firstSignal.aborted).toBe(true);
	expect(fetcher).toHaveBeenCalledTimes(2);
});
