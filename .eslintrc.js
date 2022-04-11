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
    // fixed error  createApp not found in 'vue'  import/named
    // fixed error  ref not found in 'vue'  import/named
    'import/named': 'off',

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
