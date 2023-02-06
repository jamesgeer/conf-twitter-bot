module.exports = {
	roots: ['<rootDir>'],
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
	moduleFileExtensions: ['ts', 'js', 'json', 'node'],
	collectCoverage: true,
	clearMocks: true,
	coverageDirectory: 'coverage',
	maxWorkers: 1,
	globals: {
		'ts-jest': {
			diagnostics: false,
		},
	},
	globalSetup: './jest/global-setup.ts',
	globalTeardown: './jest/global-teardown.ts',
};
