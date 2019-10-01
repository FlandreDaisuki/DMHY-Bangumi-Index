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
  ],
  rules: {
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'arrow-parens': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    // spacings
    'key-spacing': 'error',
    'comma-spacing': 'error',
    'arrow-spacing': 'error',
    'keyword-spacing': 'error',
    'object-curly-spacing': ['error', 'always'],
    'space-infix-ops': 'error',
    'space-before-blocks': 'error',
    'space-before-function-paren': ['error', 'never'],
    // warnings
    'no-console': 'off',
    'no-unused-vars': 'warn',
    // prefers
    'prefer-const': 'error',
    // @vue
    'vue/max-attributes-per-line': 'off',
    'vue/html-self-closing': ['error', {
      'html': {
        'void': 'always',
        'normal': 'never',
        'component': 'always'
      }
    }],
  },
};
