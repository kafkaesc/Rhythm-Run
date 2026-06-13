'use client';

import { MutationState, MutationAction } from '@/models/async';

/** Returns the initial idle state for a mutation hook */
export function initialMutationState<T>(): MutationState<T> {
	return { status: 'idle', data: null, error: null };
}

/**
 * Reducer function for mutation (POST/PUT/DELETE) state transitions
 * for a given data type, T.
 *
 * @param _state - The current state (unused; each action returns a full replacement).
 * @param action - The action: 'submit', 'success', 'error', or 'reset'.
 * @returns A new {@link MutationState} reflecting the dispatched action.
 */
export function mutationReducer<T>(
	_state: MutationState<T>,
	action: MutationAction<T>,
): MutationState<T> {
	if (action.type === 'submit')
		return { status: 'submitting', data: null, error: null };
	if (action.type === 'success')
		return { status: 'success', data: action.data, error: null };
	if (action.type === 'error')
		return { status: 'error', data: null, error: action.error };
	if (action.type === 'reset')
		return { status: 'idle', data: null, error: null };

	throw new Error('Unhandled action type');
}
