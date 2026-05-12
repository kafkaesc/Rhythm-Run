import A from '@/components/elements/A';
import H1 from '@/components/elements/H1';
import H2 from '@/components/elements/H2';
import P from '@/components/elements/P';
import FlatteningList from '@/components/FlatteningList';
import { ReactNodeAndKey } from '@/models/rhythmRun';

const apiList: Array<ReactNodeAndKey> = [
	{
		key: 'api_00',
		node: <A href="https://www.getsongbpm.com/api">GetSongBPM</A>,
	},
	{ key: 'api_01', node: <A href="https://www.last.fm/api">Last.fm</A> },
];

const libList: Array<ReactNodeAndKey> = [
	{ key: 'lib_00', node: <A href="https://github.com/lukeed/clsx">clsx</A> },
	{ key: 'lib_01', node: <A href="https://iconify.design">Iconify</A> },
	{
		key: 'lib_02',
		node: (
			<A href="https://github.com/dcastil/tailwind-merge">tailwind-merge</A>
		),
	},
	{
		key: 'lib_03',
		node: <A href="https://tanstack.com/table/latest">TanStack Table</A>,
	},
];

const stackList: Array<ReactNodeAndKey> = [
	{ key: 'stack_00', node: <A href="https://nextjs.org">Next</A> },
	{
		key: 'stack_01',
		node: <A href="https://www.typescriptlang.org">TypeScript</A>,
	},
	{ key: 'stack_02', node: <A href="https://react.dev">React</A> },
	{ key: 'stack_03', node: <A href="https://tailwindcss.com">Tailwind</A> },
];

const testList: Array<ReactNodeAndKey> = [
	{ key: 'test_00', node: <A href="https://jestjs.io/">Jest</A> },
	{
		key: 'test_01',
		node: (
			<A href="https://testing-library.com/docs/react-testing-library/intro/">
				React Testing Library
			</A>
		),
	},
	{ key: 'test_02', node: <A href="https://codecov.io/">Codecov</A> },
];

export default function AboutPage() {
	return (
		<main>
			<H1 className="text-center">About</H1>
			<P className="text-center mb-2">Built by Jared Hettinger</P>
			<div className="flex flex-col gap-2 px-0">
				<div className="grid grid-cols-2 gap-y-4 sm:contents">
					<div>
						<H2 className="sm:text-center">Stack</H2>
						<FlatteningList
							list={stackList}
							separator="//"
							className="sm:justify-center"
						/>
					</div>
					<div>
						<H2 className="sm:text-center">APIs</H2>
						<FlatteningList
							list={apiList}
							separator="//"
							className="sm:justify-center"
						/>
					</div>
					<div>
						<H2 className="sm:text-center">Libraries</H2>
						<FlatteningList
							list={libList}
							separator="//"
							className="sm:justify-center"
						/>
					</div>
					<div>
						<H2 className="sm:text-center">Testing</H2>
						<FlatteningList
							list={testList}
							separator="//"
							className="sm:justify-center"
						/>
					</div>
				</div>
			</div>
		</main>
	);
}
