import { initialState, reducer } from './asyncReducer';

it('Has initialState return an idle status with null data and error', () => {
	const state = initialState();
	expect(state).toEqual({ status: 'idle', data: null, error: null });
});

it('Has reducer return a loading state on a fetch action', () => {
	const state = reducer(initialState(), { type: 'fetch' });
	expect(state).toEqual({ status: 'loading', data: null, error: null });
});

it('Has reducer return a success state with data on a success action', () => {
	const state = reducer(initialState(), { type: 'success', data: ['a', 'b'] });
	expect(state).toEqual({ status: 'success', data: ['a', 'b'], error: null });
});

it('Has reducer return an error state with a message on an error action', () => {
	const state = reducer(initialState(), {
		type: 'error',
		error: 'Oops! Something went wrong',
	});
	expect(state).toEqual({
		status: 'error',
		data: null,
		error: 'Oops! Something went wrong',
	});
});

it('Has reducer return an idle state on a clear action', () => {
	const state = reducer(initialState(), { type: 'clear' });
	expect(state).toEqual({ status: 'idle', data: null, error: null });
});

it('Has reducer throw on an unhandled action type', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	expect(() => reducer(initialState(), { type: 'unknown' } as any)).toThrow(
		'Unhandled action type',
	);
});
