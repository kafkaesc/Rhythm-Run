'use client';

import { Dispatch } from 'react';
import { AsyncState, AsyncAction } from '@/models/async';

/** Returns the initial idle state for an async fetch hook */
export function initialState<T>(): AsyncState<T> {
	return { data: null, error: null, status: 'idle' };
}

/**
 * Reducer function for async fetch state transitions for a given data type, T.
 *
 * @param _state - The current state (unused; each action returns a full replacement).
 * @param action - The action describing the transition: 'fetch', 'success', 'error', or 'clear'.
 * @returns A new {@link AsyncState} reflecting the dispatched action.
 */
export function reducer<T>(
	_state: AsyncState<T>,
	action: AsyncAction<T>,
): AsyncState<T> {
	if (action.type === 'fetch')
		return { data: null, error: null, status: 'loading' };
	if (action.type === 'streaming')
		return { data: action.data, error: null, status: 'streaming' };
	if (action.type === 'success')
		return { data: action.data, error: null, status: 'success' };
	if (action.type === 'error')
		return { data: null, error: action.error, status: 'error' };
	if (action.type === 'clear')
		return { data: null, error: null, status: 'idle' };

	throw new Error('Unhandled action type');
}

/**
 * Dispatches an error action for a failed async request, ignores intentional
 * aborts (request superseded or component unmounted). Non-Error failures fall
 * back to a generic message.
 *
 * @param err - The thrown value from the failed request
 * @param dispatch - The async reducer dispatch to report the error to
 */
export function dispatchAsyncError<T>(
	err: unknown,
	dispatch: Dispatch<AsyncAction<T>>,
): void {
	// AbortError is intentional (request superseded or unmounted), so ignore it
	if ((err as Error).name === 'AbortError') return;

	dispatch({
		error: err instanceof Error ? err.message : 'Unknown error',
		type: 'error',
	});
}
