const js = require("@eslint/js");
const seguridad = require("eslint-plugin-security");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  seguridad.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { ...globals.node },
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^next$" }],
    },
  },
  {
    ignores: ["node_modules/**", "coverage/**", "reportes/**"],
  },
];
