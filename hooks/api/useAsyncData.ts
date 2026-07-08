'use client';

import { useEffect, useReducer, type DependencyList } from 'react';
import {
	dispatchAsyncError,
	initialState,
	reducer,
} from '@/hooks/api/asyncReducer';

/**
 * Performs a request and resolves the parsed data.
 * Listens for an AbortSignal to cancel the request if needed.
 */
type Fetcher<T> = (signal: AbortSignal) => Promise<T>;

/**
 * Runs an async fetch whenever `deps` change, tracking loading, success, and
 * error state and aborting any in-flight request on cleanup. Pass `null` for
 * `fetcher` to disable the request and clear state, e.g. when the input is empty.
 *
 * @param fetcher - Null => disabled, function performs the request and returns parsed data
 * @param deps - Dependency list controlling when the fetch re-runs
 * @returns The current data, a loading flag, and any error message
 */
export function useAsyncData<T>(
	fetcher: Fetcher<T> | null,
	deps: DependencyList,
) {
	const [state, dispatch] = useReducer(reducer<T>, initialState<T>());

	useEffect(() => {
		// Disabled/fetcher is null: clear any previous result and skip fetching
		if (!fetcher) {
			dispatch({ type: 'clear' });
			return;
		}

		// Mark loading before the request starts
		dispatch({ type: 'fetch' });

		// Abort the request if deps change or the component unmounts mid-flight
		const controller = new AbortController();

		fetcher(controller.signal)
			.then((data) => {
				// Store the parsed data
				return dispatch({ data, type: 'success' });
			})
			.catch((err: unknown) => {
				// Ignore intentional aborts, report any other failure as an error
				dispatchAsyncError(err, dispatch);
			});

		// Abort an in-flight request if deps change or the component unmounts
		return () => controller.abort();
		// dependencies are passed from the caller who is responsible
		// for managing them, we do not include them here
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

	return {
		data: state.data,
		loading: state.status === 'loading',
		error: state.error,
	};
}
