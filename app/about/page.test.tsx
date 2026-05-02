import { render, screen } from '@testing-library/react';
import AboutPage from './page';

it("renders an h1 containing 'About'", () => {
	render(<AboutPage />);
	expect(
		screen.getByRole('heading', { level: 1, name: /about/i }),
	).toBeInTheDocument();
});
