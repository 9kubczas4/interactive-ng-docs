const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const boundariesPlugin = require('eslint-plugin-boundaries');
const boundariesConfig = require('./boundaries.json');

module.exports = tseslint.config(
  {
    ignores: ['.angular/**', 'dist/**'],
  },
  {
    files: ['**/*.ts'],
    plugins: {
      boundaries: boundariesPlugin,
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          message: '${file.type} is not allowed to import ${dependency.type}',
          rules: boundariesConfig.rules,
        },
      ],
    },
    settings: {
      'boundaries/elements': boundariesConfig.elements,
      'boundaries/ignore': ['**/**.spec.ts'],
      'import/resolver': {
        typescript: {},
      },
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  }
);
