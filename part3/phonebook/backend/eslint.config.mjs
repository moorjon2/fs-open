import js from "@eslint/js";
import globals from "globals";
import stylisticJs from "@stylistic/eslint-plugin-js";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    // Apply recommended rules from ESLint for JS
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    // Configure CommonJS-specific features
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { ...globals.node },
      ecmaVersion: "latest",
    },
  },
  {
    // Configure Browser-specific globals
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    // Add stylistic rules
    files: ["**/*.{js,mjs,cjs}"],
    plugins: {
      "@stylistic/js": stylisticJs,
    },
    rules: {
      "@stylistic/js/indent": ["error", 2], // Enforce 2 spaces for indentation
      "@stylistic/js/linebreak-style": ["error", "unix"], // Enforce Unix linebreaks
      "@stylistic/js/quotes": ["error", "single"], // Enforce single quotes
      "@stylistic/js/semi": ["error", "never"], // Disallow semicolons
    },
  },
]);