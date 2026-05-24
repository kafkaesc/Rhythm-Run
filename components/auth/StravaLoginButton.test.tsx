import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StravaLoginButton from './StravaLoginButton';

const mockSignIn = jest.fn();
const mockSignOut = jest.fn();
const mockUseSession = jest.fn();

jest.mock('next-auth/react', () => ({
	useSession: () => mockUseSession(),
	signIn: (...args: unknown[]) => mockSignIn(...args),
	signOut: (...args: unknown[]) => mockSignOut(...args),
}));

beforeEach(() => {
	mockSignIn.mockClear();
	mockSignOut.mockClear();
	mockUseSession.mockClear();
});

it('Renders the login button when unauthenticated', () => {
	mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
	render(<StravaLoginButton />);
	const btn = screen.getByRole('button', { name: /login with strava/i });
	expect(btn).toBeInTheDocument();
});

it('Renders nothing while the session is loading', () => {
	mockUseSession.mockReturnValue({ data: null, status: 'loading' });
	const { container } = render(<StravaLoginButton />);
	expect(container).toBeEmptyDOMElement();
});

it('Renders nothing when the user is logged in via Spotify', () => {
	mockUseSession.mockReturnValue({
		data: { user: { name: 'Gregor Samsa' }, spotifyAccessToken: 'token1915' },
		status: 'authenticated',
	});
	const { container } = render(<StravaLoginButton />);
	expect(container).toBeEmptyDOMElement();
});

it('Calls signIn with strava when the login button is clicked', async () => {
	mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
	render(<StravaLoginButton />);
	const btn = screen.getByRole('button', { name: /login with strava/i });
	await userEvent.click(btn);
	expect(mockSignIn).toHaveBeenCalledWith('strava');
});

it('Renders the logout button when authenticated', () => {
	mockUseSession.mockReturnValue({
		data: { user: { name: 'Gregor Samsa' }, stravaAccessToken: 'token1915' },
		status: 'authenticated',
	});
	render(<StravaLoginButton />);
	const btn = screen.getByRole('button', { name: /logout/i });
	expect(btn).toBeInTheDocument();
});

it('Renders the user name when authenticated', () => {
	mockUseSession.mockReturnValue({
		data: { user: { name: 'Gregor Samsa' }, stravaAccessToken: 'token1915' },
		status: 'authenticated',
	});
	render(<StravaLoginButton />);
	expect(screen.getByText('Gregor Samsa')).toBeInTheDocument();
});

it('Calls signOut when the logout button is clicked', async () => {
	mockUseSession.mockReturnValue({
		data: { user: { name: 'Gregor Samsa' }, stravaAccessToken: 'token1915' },
		status: 'authenticated',
	});
	render(<StravaLoginButton />);
	const btn = screen.getByRole('button', { name: /logout/i });
	await userEvent.click(btn);
	expect(mockSignOut).toHaveBeenCalledTimes(1);
});
