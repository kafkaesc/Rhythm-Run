import { render, screen } from '@testing-library/react';
import SearchStatus from './SearchStatus';

it('Renders the error message when err is truthy', () => {
	render(
		<SearchStatus
			err="error"
			errMessage="I'm afraid I can't do that"
			loading={null}
		/>,
	);
	const status = screen.getByText(/I can't do that/i);
	expect(status).toBeInTheDocument();
});

it('Does not render the error message when err is null', () => {
	render(
		<SearchStatus err={null} errMessage="Error with the API" loading={null} />,
	);
	const status = screen.queryByText(/error with the api/i);
	expect(status).not.toBeInTheDocument();
});

it('Renders loading text when loading is true', () => {
	render(
		<SearchStatus err={null} errMessage="Error with the API" loading={true} />,
	);
	const status = screen.getByText(/loading/i);
	expect(status).toBeInTheDocument();
});

it('Does not render loading text when loading is null', () => {
	render(
		<SearchStatus err={null} errMessage="Error with the API" loading={null} />,
	);
	const status = screen.queryByText(/loading/i);
	expect(status).not.toBeInTheDocument();
});

it('Renders a non-breaking space when there is no error and not loading', () => {
	render(
		<SearchStatus err={null} errMessage="Error with the API" loading={null} />,
	);
	const status = screen.getByText(/\u00A0/, { normalizer: (text) => text });
	expect(status).toBeInTheDocument();
});

it('Does not render a non-breaking space when loading', () => {
	render(
		<SearchStatus err={null} errMessage="Error with the API" loading={true} />,
	);
	const status = screen.queryByText(/\u00A0/, { normalizer: (text) => text });
	expect(status).not.toBeInTheDocument();
});

it('Does not render a non-breaking space when there is an error', () => {
	render(
		<SearchStatus err="error" errMessage="Error with the API" loading={null} />,
	);
	const status = screen.queryByText(/\u00A0/, { normalizer: (text) => text });
	expect(status).not.toBeInTheDocument();
});
