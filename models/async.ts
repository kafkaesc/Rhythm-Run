export type AsyncState<T> =
	| { status: 'idle'; data: null; error: null }
	| { status: 'loading'; data: null; error: null }
	| { status: 'success'; data: T; error: null }
	| { status: 'error'; data: null; error: string };

export type AsyncAction<T> =
	| { type: 'fetch' }
	| { type: 'success'; data: T }
	| { type: 'error'; error: string }
	| { type: 'clear' };
