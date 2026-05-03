'use client';

import { AsyncState, AsyncAction } from '@/models/async';

/** Returns the initial idle state for an async fetch hook */
export function initialState<T>(): AsyncState<T> {
	return { status: 'idle', data: null, error: null };
}

/**
 * Reducer function for async fetch state transitions for a given data type, T.
 * @param _state - The current state (unused; each action returns a full replacement).
 * @param action - The action describing the transition: 'fetch', 'success', 'error', or 'clear'.
 * @returns A new {@link AsyncState} reflecting the dispatched action.
 */
export function reducer<T>(
	_state: AsyncState<T>,
	action: AsyncAction<T>,
): AsyncState<T> {
	if (action.type === 'fetch')
		return { status: 'loading', data: null, error: null };
	if (action.type === 'success')
		return { status: 'success', data: action.data, error: null };
	if (action.type === 'error')
		return { status: 'error', data: null, error: action.error };
	if (action.type === 'clear')
		return { status: 'idle', data: null, error: null };

	throw new Error('Unhandled action type');
}
