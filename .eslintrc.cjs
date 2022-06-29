module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'jest',
    'prettier',
  	'plugin:node/recommended'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'prettier'
  ],
  env: {
    browser: true,
    node: true
  },
  ignorePatterns: ["dist/**/*", "node_modules/**/*"],
  rules: {
    'max-len': ['error', { 'code': 120 }],
    'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
    'indent': ['error', "tab"],
    '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': [
      'error',
      { allowArgumentsExplicitlyTypedAsAny: true }
    ],
    'jest/no-conditional-expect': 'off',
    'prettier/prettier': 2
  }
};
