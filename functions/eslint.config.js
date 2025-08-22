import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: ["./tsconfig.json"],
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      "quotes": ["error", "double"],
      "import/no-unresolved": "off",
      "indent": ["error", 2],
      "object-curly-spacing": ["error", "never"],
      "max-len": ["error", { "code": 100 }],
      "comma-dangle": ["error", "always-multiline"],
    },
  },
  {
    ignores: ["lib/**/*", "node_modules/**/*"],
  },
];
