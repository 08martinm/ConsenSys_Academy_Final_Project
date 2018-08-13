module.exports = {
  extends: [
    "@tokenfoundry/eslint-config/react",
    "@tokenfoundry/eslint-config/jest",
  ],
  rules: {
    "react/no-array-index-key": "off",
    "lines-between-class-members": "off",
    "promise/prefer-await-to-then": "off",
    "react/forbid-prop-types": "off",
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: ["Link"],
        specialLink: ["to"],
      },
    ],
    "no-shadow": [
      "error",
      {
        builtinGlobals: true,
        hoist: "all",
        allow: [
          "Text",
          "id",
          "name",
          "assert",
          "server",
          "context",
          "status",
          "form",
          "test",
        ],
      },
    ],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: ["**/*.stories.js", "**/*.test.js", "**/config/**"],
      },
    ],
    "require-underscore-lodash-import/require-underscore-lodash-import": "error"
  },
  plugins: ["require-underscore-lodash-import", "eslint-plugin-require-underscore-lodash-import"],
};
