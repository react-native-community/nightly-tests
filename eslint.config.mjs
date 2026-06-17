import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import jsPlugin from '@eslint/js';
import jsonPlugin from '@eslint/json';
import markdownPlugin from '@eslint/markdown';
import prettierPlugin from 'eslint-plugin-prettier/recommended';

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
      'sort-imports': [
        'error',
        {
          allowSeparatedGroups: true,
        },
      ],
      'import/no-unresolved': 'off',
      'import/enforce-node-protocol-usage': ['error', 'always'],
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
