import { initialMutationState, mutationReducer } from './mutationReducer';

it('Has initialMutationState return an idle status with null data and error', () => {
	const state = initialMutationState();
	expect(state).toEqual({ status: 'idle', data: null, error: null });
});

it('Has mutationReducer return a submitting state on a submit action', () => {
	const state = mutationReducer(initialMutationState(), { type: 'submit' });
	expect(state).toEqual({ status: 'submitting', data: null, error: null });
});

it('Has mutationReducer return a success state with data on a success action', () => {
	const state = mutationReducer(initialMutationState(), {
		type: 'success',
		data: 'hello world',
	});
	expect(state).toEqual({
		status: 'success',
		data: 'hello world',
		error: null,
	});
});

it('Has mutationReducer return an error state with a message on an error action', () => {
	const state = mutationReducer(initialMutationState(), {
		type: 'error',
		error: 'Something went wrong',
	});
	expect(state).toEqual({
		status: 'error',
		data: null,
		error: 'Something went wrong',
	});
});

it('Has mutationReducer return an idle state on a reset action', () => {
	const state = mutationReducer(initialMutationState(), { type: 'reset' });
	expect(state).toEqual({ status: 'idle', data: null, error: null });
});

it('Has mutationReducer throw on an unhandled action type', () => {
	expect(() =>
		// TypeScript prevents unknown action types at compile,
		// any is needed to reach the runtime throw for testing
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		mutationReducer(initialMutationState(), { type: 'unknown' } as any),
	).toThrow('Unhandled action type');
});
