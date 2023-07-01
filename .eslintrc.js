"use strict";

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  globals: {
    require: true,
    process: true,
    setImmediate: true,
    Buffer: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  parser: "@typescript-eslint/parser",
  extends: [
    "prettier",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: [
    "react",
    "react-hooks",
    "@typescript-eslint",
    "jsx-a11y",
    "eslint-plugin-import",
  ],
  rules: {
    // OFF
    "class-methods-use-this": 0,
    "import/prefer-default-export": 0,
    "jsx-a11y/label-has-for": 0,
    "jsx-a11y/heading-has-content": 0,
    "jsx-a11y/label-has-associated-control": 0,
    "linebreak-style": 0,
    "no-underscore-dangle": 0,
    "prefer-destructuring": 0,
    "react/forbid-prop-types": 0,
    "react/jsx-indent": 0,
    "react/no-did-mount-set-state": 0,
    "react/no-did-update-set-state": 0,
    "react/require-default-props": 0,
    "react/jsx-one-expression-per-line": 0,
    "lines-between-class-members": 0,
    "react/destructuring-assignment": 0,
    "react/jsx-wrap-multilines": 0,
    "react/sort-comp": 0,
    "react/prop-types": 0,
    "no-await-in-loop": 0,
    camelcase: 0,
    "no-continue": 0,
    "guard-for-in": 0,
    "global-require": 0,
    "no-param-reassign": 0,
    "func-names": 0,

    "react/jsx-props-no-spreading": 0,
    "react/state-in-constructor": 0,
    "react/jsx-fragments": 0,
    "react/static-property-placement": 0,
    "max-classes-per-file": 0,
    "react-hooks/exhaustive-deps": 0,
    "react/jsx-uses-react": 0,
    "react/react-in-jsx-scope": 0,

    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-loss-of-precision": 0,
    "@typescript-eslint/no-empty-function": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "import/extensions": [
      0,
      "always",
      {
        ignorePackages: true,
        extensions: {
          js: "never",
          ts: "never",
          tsx: "never",
        },
      },
    ],

    // WARN
    "@typescript-eslint/no-unused-vars": [1, { ignoreRestSiblings: true }],
    "no-console": [1, { allow: ["assert"] }],
    "no-debugger": 1,
    "react/no-unused-prop-types": 1,
    "react/no-array-index-key": 1,
    "react/default-props-match-prop-types": 1,
    "react/prefer-stateless-function": 1,
    "react/no-unused-state": 1,
    "react/jsx-curly-brace-presence": 1,
    "arrow-body-style": 1,
    "valid-jsdoc": [1],
    "prefer-const": 1,
    "import/first": 1,
    "object-shorthand": 1,
    "react/no-access-state-in-setstate": 1,
    "require-await": 1,
    "import/order": [
      1,
      {
        groups: [
          "builtin",
          "external",
          "type",
          "internal",
          ["parent", "sibling"],
        ],
      },
    ],

    // ERROR

    // since the aim of app is comparison between different state managers
    "react-hooks/rules-of-hooks": 0,
    // "react-hooks/rules-of-hooks": 2,
    "jsx-a11y/anchor-is-valid": [
      2,
      {
        components: ["Link"],
        specialLink: ["hrefLeft", "hrefRight", "to"],
        aspects: ["noHref", "invalidHref", "preferButton"],
      },
    ],
    "no-unused-expressions": [2, { allowTaggedTemplates: true }],
    "react/jsx-filename-extension": [2, { extensions: [".js", ".tsx"] }],
    "no-restricted-syntax": [2, "WithStatement"],
  },
  settings: {
    "import/resolver": {
      node: {
        paths: ["src"],
        extensions: [".js", ".ts", ".tsx"],
      },
    },
  },
};
