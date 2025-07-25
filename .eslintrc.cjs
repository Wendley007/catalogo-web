module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  parserOptions: {
    ecmaVersion: "latest", // Usa o último padrão ECMAScript
    sourceType: "module",
    ecmaFeatures: { jsx: true }, // Habilita JSX
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime", // Para React 17+ JSX Transform
    "plugin:react-hooks/recommended", // React Hooks
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  settings: {
    react: { version: "18.2" },
  },
  plugins: ["react-refresh"],
  rules: {
    "react/jsx-no-target-blank": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
};
