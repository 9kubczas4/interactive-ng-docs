import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import boundaries from 'eslint-plugin-boundaries';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      boundaries,
    },
    rules: {
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: 'shared',
              allow: ['shared'],
            },
            {
              from: 'core',
              allow: ['shared', 'core'],
            },
            {
              from: 'features',
              allow: ['shared', 'core', 'features'],
            },
          ],
        },
      ],
    },
    settings: {
      'boundaries/dependency-nodes': ['import'],
      'boundaries/elements': [
        {
          type: 'shared',
          pattern: 'src/app/shared/**',
        },
        {
          type: 'core',
          pattern: 'src/app/core/**',
        },
        {
          type: 'features',
          pattern: 'src/app/features/**',
        },
      ],
    },
  },
  {
    files: ['*.js', '*.mjs', '*.cjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
      },
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**', '.angular/**', 'coverage/**', '*.d.ts'],
  },
];
