import { renderHook } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useSessionStatus } from './useSessionStatus';

// Mock the useSession hook that useSessionStatus wraps
jest.mock('next-auth/react', () => ({ useSession: jest.fn() }));
const mockUseSession = useSession as jest.Mock;

// Default to a logged out state before each test
beforeEach(() => {
	mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
});

it('hasSession returns false when there is no session', () => {
	const { result } = renderHook(() => useSessionStatus());
	expect(result.current.hasSession()).toBe(false);
});

it('hasSession returns true when there is a session', () => {
	mockUseSession.mockReturnValue({
		data: { user: { name: 'Gregor Samsa' } },
		status: 'authenticated',
	});
	const { result } = renderHook(() => useSessionStatus());
	expect(result.current.hasSession()).toBe(true);
});

it('hasSpotify returns false when there is no session', () => {
	const { result } = renderHook(() => useSessionStatus());
	expect(result.current.hasSpotify()).toBe(false);
});

it('hasSpotify returns false when there is a session but no Spotify token', () => {
	mockUseSession.mockReturnValue({
		data: { user: { name: 'Gregor Samsa' } },
		status: 'authenticated',
	});
	const { result } = renderHook(() => useSessionStatus());
	expect(result.current.hasSpotify()).toBe(false);
});

it('hasSpotify returns true when there is a session with a Spotify token', () => {
	mockUseSession.mockReturnValue({
		data: { user: { name: 'Gregor Samsa' }, spotifyAccessToken: 'token1915' },
		status: 'authenticated',
	});
	const { result } = renderHook(() => useSessionStatus());
	expect(result.current.hasSpotify()).toBe(true);
});

it('hasStrava always returns false', () => {
	const { result } = renderHook(() => useSessionStatus());
	expect(result.current.hasStrava()).toBe(false);
});

it('Returns the session object', () => {
	const session = { user: { name: 'Gregor Samsa' } };
	mockUseSession.mockReturnValue({ data: session, status: 'authenticated' });
	const { result } = renderHook(() => useSessionStatus());
	expect(result.current.session).toBe(session);
});

it('Returns the status', () => {
	mockUseSession.mockReturnValue({ data: null, status: 'loading' });
	const { result } = renderHook(() => useSessionStatus());
	expect(result.current.status).toBe('loading');
});
