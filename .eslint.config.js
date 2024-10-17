module.exports = {
  env: {
    node: true,
  },
  extends: [
    "plugin:import/typescript",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:import/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  ignorePatterns: ["build", "node_modules"],
  root: true,
  settings: {
    "import/resolver": {
      node: {
        extensions: [".ts", ".js"],
        moduleDirectory: ["node_modules", "src/"],
        tsconfigRootDir: "./",
      },
    },
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json"],
  },
  rules: {
    "import/order": ["error", { "newlines-between": "always" }],
  },
};
