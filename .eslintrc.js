module.exports = {
  env: {
    greasemonkey: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  extends: [
    'plugin:vue/recommended',
    '@flandredaisuki',
  ],
  rules: {
    // @vue
    'vue/max-attributes-per-line': 'off',
    'vue/html-self-closing': ['error', {
      html: {
        void: 'always',
        normal: 'never',
        component: 'always',
      },
    }],
  },
};
