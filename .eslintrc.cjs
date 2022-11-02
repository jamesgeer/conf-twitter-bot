module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true
		}
	},
	settings: {
		react: {
			version: '18.2.0'
		},
	},
	env: {
		es6: true,
		browser: true,
		node: true,
	},
	plugins: [
		'react',
		'jest',
		'prettier',
		'@typescript-eslint'
	],
	extends: [
		'eslint:recommended',
		'prettier',
		'node',
		'plugin:node/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:jest/recommended',
		'plugin:react/recommended',
		'airbnb-base',
		'airbnb-typescript/base'
	],
	ignorePatterns: ['dist/**/*', 'node_modules/**/*'],
	rules: {
		'no-tabs': 'off',
		'no-shadow': 'off',
		'no-console': 'off',
		'func-names': 'off',
		'no-continue': 'off',
		'no-plusplus': 'off',
		'no-param-reassign': 'off',
		'operator-linebreak': 'off',
		'object-curly-newline': 'off',
		'no-restricted-syntax': 'off',
		'node/no-missing-import': 'off',
		'implicit-arrow-linebreak': 'off',
		'import/prefer-default-export': 'off',
		'node/no-unpublished-import': 'off',
		'node/no-unsupported-features/es-syntax': 'off',
		'node/no-unsupported-features/node-builtins': 'off',
		'max-len': ['error', { 'code': 120 }],
		'quotes': [2, 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true }],
		'no-use-before-define': ['error', {"functions": false, "classes": false}],
		'@typescript-eslint/no-shadow': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/keyword-spacing': 'off',
		'@typescript-eslint/indent': ['error', 'tab'],
		'@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
		'@typescript-eslint/no-use-before-define': ['error', {"functions": false, "classes": false}],
		'@typescript-eslint/explicit-module-boundary-types': [
			'error', { allowArgumentsExplicitlyTypedAsAny: true },
		],
		'jest/no-conditional-expect': 'off',
		'prettier/prettier': ['error', { singleQuote: true }]
	},
};
