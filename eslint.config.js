import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import js from '@eslint/js'
import ts from 'typescript-eslint'
import {defineConfig} from 'eslint/config'

export default defineConfig(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: [
      '**/*.svelte',
      '**/*.svelte.ts',
      '**/*.svelte.js',
      '**/*.js',
      '**/*.ts',
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: ['.svelte'],
        parser: ts.parser,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],

      'no-unused-vars': ['error', {varsIgnorePattern: '_'}],
      'no-multi-spaces': 'error',
      'no-invalid-this': 'error',
      'no-trailing-spaces': 'error',

      'array-bracket-spacing': ['error', 'never'],
      'object-curly-spacing': ['error', 'never'],
      camelcase: ['error', {properties: 'never'}],
      'comma-spacing': 'error',
      'comma-style': 'error',

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-extra-semi': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/ban-types': 'off',
    },
  },
)
