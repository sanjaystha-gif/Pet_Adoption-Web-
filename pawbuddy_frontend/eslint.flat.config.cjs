// Minimal flat ESLint config to lint TypeScript files without Next-specific configs
module.exports = [
  {
    ignores: ['node_modules/**', 'dist/**', '.next/**', 'scripts/**', 'eslint.flat.config.cjs'],
  },
  {
    linterOptions: { reportUnusedDisableDirectives: true },
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { '@typescript-eslint': require('@typescript-eslint/eslint-plugin') },
    // Start with recommended rules, then override them with our custom settings
    rules: Object.assign(
      require('@typescript-eslint/eslint-plugin').configs.recommended.rules || {},
      {
        'no-console': 'warn',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      }
    ),
  },
]
