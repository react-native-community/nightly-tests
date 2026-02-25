import jsPlugin from '@eslint/js';
import jsonPlugin from '@eslint/json';
import markdownPlugin from '@eslint/markdown';
import { defineConfig, globalIgnores } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default defineConfig([
  globalIgnores(['website']),

  prettierPlugin,
  importPlugin.flatConfigs.recommended,

  {
    rules: {
      'prettier/prettier': [
        'error',
        {
          arrowParens: 'avoid',
          bracketSameLine: true,
          printWidth: 80,
          singleQuote: true,
          trailingComma: 'es5',
          endOfLine: 'auto',
        },
      ],
    },
  },

  {
    files: ['**/*.{js,mjs}'],
    plugins: {
      js: jsPlugin,
    },
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    extends: ['js/recommended'],
    rules: {
      'import/no-unresolved': 'off',
      'import/enforce-node-protocol-usage': ['error', 'always'],
      'import/order': [
        'error',
        {
          groups: [['external', 'builtin'], 'internal', ['parent', 'sibling']],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
          },
        },
      ],
    },
  },

  {
    files: ['**/*-test.js'],
    plugins: { jest: jestPlugin },
    languageOptions: {
      globals: jestPlugin.environments.globals.globals,
    },
    ...jestPlugin.configs['flat/recommended'],
  },

  {
    files: ['**/*.json'],
    language: 'json/json',
    plugins: {
      json: jsonPlugin,
    },
    extends: ['json/recommended'],
  },

  {
    files: ['**/*.md'],
    plugins: {
      markdown: markdownPlugin,
    },
    extends: ['markdown/recommended'],
  },
]);
