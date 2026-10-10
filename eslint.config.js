import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import globals from "globals";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["src/**/*.jsx"],

    extends: [
      js.configs.recommended,
      react.configs.flat.recommended,
      reactHooks.configs.flat.recommended,
    ],

    plugins: {
      "unused-imports": unusedImports,
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      "no-console": "off",
      "no-param-reassign": ["error", { props: false }],
      "no-unused-vars": [
        "error",
        {
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "lines-between-class-members": "off",

      "react/display-name": "off",
      "react/forbid-prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/require-default-props": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-wrap-multilines": ["error", { prop: "ignore" }],

      "unused-imports/no-unused-imports": "error",
    },

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
      },
    },
  },
  eslintConfigPrettier,
]);
