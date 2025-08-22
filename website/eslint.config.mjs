import jsPlugin from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import { defineConfig, globalIgnores } from "eslint/config";
import reactPlugin from "eslint-plugin-react";
import prettierPlugin from "eslint-plugin-prettier/recommended";
import typescriptESLint from "typescript-eslint";
import { parserPlain, plugin as pluginSVGO } from "eslint-plugin-svgo";

export default defineConfig([
  globalIgnores([
    ".next/**",
    "build/**",
    "node_modules/**",
    "out/**",
    "next-env.d.ts",
  ]),

  prettierPlugin,

  {
    files: ["**/*.js", "**/*.mjs"],
    plugins: {
      js: jsPlugin,
    },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        Buffer: "readonly",
        console: "readonly",
        process: "readonly",
      },
    },
  },

  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
    },
    rules: {
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "@next/next/no-img-element": "off",
    },
    languageOptions: {
      parser: typescriptESLint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },

  {
    files: ["**/*.svg"],
    plugins: {
      svgo: pluginSVGO,
    },
    languageOptions: {
      parser: parserPlain,
    },
    rules: {
      "prettier/prettier": "off",
      "svgo/svgo": [
        "error",
        {
          floatPrecision: 2,
          js2svg: {
            pretty: true,
          },
          plugins: [
            "preset-default",
            {
              name: "preset-default",
              params: {
                overrides: {
                  cleanupIds: {
                    minify: false,
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
]);
