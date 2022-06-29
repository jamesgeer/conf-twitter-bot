module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	env: {
		browser: true,
		node: true,
	},
	plugins: [
		'@typescript-eslint',
		'jest',
		'prettier',
	],
	extends: [
		'eslint:recommended',
		'node',
		'plugin:node/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:jest/recommended',
		'prettier',
		'airbnb-base',
		'airbnb-typescript/base'
	],
	ignorePatterns: ['dist/**/*', 'node_modules/**/*'],
	rules: {
		'max-len': ['error', { 'code': 120 }],
		'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
		'@typescript-eslint/indent': ['error', 'tab'],
		'no-tabs': ["error", { allowIndentationTabs: true }],
		'no-console': "off",
		'@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/explicit-module-boundary-types': [
			'error',
			{ allowArgumentsExplicitlyTypedAsAny: true },
		],
		'jest/no-conditional-expect': 'off',
		'prettier/prettier': 2,
	},
};
