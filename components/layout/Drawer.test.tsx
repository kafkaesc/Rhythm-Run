import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Drawer from './Drawer';

it('Renders the menu button', () => {
	render(<Drawer />);
	const menuBtn = screen.getByRole('button', { name: /open menu/i });
	expect(menuBtn).toBeInTheDocument();
});

it('Menu button has aria-expanded false because the drawer is closed', () => {
	render(<Drawer />);
	const menuBtn = screen.getByRole('button', { name: /open menu/i });
	expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
});

it('Clicking the menu button opens the drawer', async () => {
	render(<Drawer />);
	const menuBtn = screen.getByRole('button', { name: /open menu/i });
	await userEvent.click(menuBtn);
	expect(menuBtn).toHaveAttribute('aria-expanded', 'true');
});

it('Clicking the menu button transforms it to close and closes the drawer', async () => {
	render(<Drawer />);
	const menuBtn = screen.getByRole('button', { name: /open menu/i });
	await userEvent.click(menuBtn);
	expect(menuBtn).toHaveAccessibleName(/close menu/i);
	await userEvent.click(menuBtn);
	expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
});

it('Drawer close button is accessible when the drawer is open', async () => {
	render(<Drawer />);
	const menuBtn = screen.getByRole('button', { name: /open menu/i });
	await userEvent.click(menuBtn);
	const closeButtons = screen.getAllByRole('button', { name: /close menu/i });
	expect(closeButtons.length).toBe(2);
});

it('Clicking the close button inside the panel closes the drawer', async () => {
	render(<Drawer />);
	const menuBtn = screen.getByRole('button', { name: /open menu/i });
	await userEvent.click(menuBtn);
	const closeButtons = screen.getAllByRole('button', { name: /close menu/i });
	const panelCloseBtn = closeButtons.find(
		(b) => !b.hasAttribute('aria-expanded'),
	)!;
	await userEvent.click(panelCloseBtn);
	expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
});

it('Renders children inside the drawer', () => {
	render(<Drawer>drawer content</Drawer>);
	const content = screen.getByText(/drawer content/i);
	expect(content).toBeInTheDocument();
});

it('Renders the title when the title prop is provided', () => {
	render(<Drawer title="My Menu" />);
	const title = screen.getByText(/my menu/i);
	expect(title).toBeInTheDocument();
});

it('Renders the headerRight prop', () => {
	render(<Drawer headerRight={<span>side display</span>} />);
	const headerSideContent = screen.getByText(/side display/i);
	expect(headerSideContent).toBeInTheDocument();
});
