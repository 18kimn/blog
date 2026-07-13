import svelte from "eslint-plugin-svelte"
import globals from "globals"
import js from "@eslint/js"
import ts from "typescript-eslint"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import {defineConfig, globalIgnores} from "eslint/config"

export default defineConfig([
  globalIgnores([
    "node_modules/",
    ".git/",
    ".svelte-kit/",
    "build/",
    "error-build/",
  ]),
  {
    files: [
      "**/*.svelte",
      "**/*.svelte.ts",
      "**/*.svelte.js",
      "**/*.js",
      "**/*.ts",
    ],
    extends: [
      js.configs.recommended,
      ts.configs.recommended,
      svelte.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            "eslint.config.js",
            "svelte.config.js",
            "prisma.config.ts",
            "worker/index.js",
          ],
        },
        extraFileExtensions: [".svelte"],
        parser: ts.parser,
      },
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      indent: ["error", 2],
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "double"],
      semi: ["error", "never"],

      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {varsIgnorePattern: "_", argsIgnorePattern: "_"},
      ],
      "no-multi-spaces": "error",
      "no-invalid-this": "error",
      "no-trailing-spaces": "error",

      "array-bracket-spacing": ["error", "never"],
      "object-curly-spacing": ["error", "never"],
      camelcase: ["error", {properties: "never"}],
      "comma-spacing": "error",
      "comma-style": "error",

      "svelte/no-at-html-tags": "off",

      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-extra-semi": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/ban-types": "off",
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
  eslintConfigPrettier,
])
