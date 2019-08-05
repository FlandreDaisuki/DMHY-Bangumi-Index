const error = 'error';

module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true,
    greasemonkey: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 10
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    '@vue/prettier',
  ],
  rules: {
    'no-console': 'off',
    'key-spacing': error,
    'comma-spacing': error,
    'arrow-spacing': error,
    'keyword-spacing': error,
    'space-infix-ops': error,
    'object-curly-spacing': [error, 'always'],
    'space-before-blocks': error
  },
};
