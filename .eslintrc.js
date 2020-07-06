module.exports = {
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    "react/prop-types": 0,
  },
  plugins: [],
  extends: ["eslint:recommended", "prettier"],
  settings: {
    react: {
      pragma: "React",
      version: "detect",
    },
  },
};
