import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
	testEnvironment: 'jest-environment-jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/mocks/'],
};

export default createJestConfig(config);
