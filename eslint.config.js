import js from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';

/** @type {import('eslint').Linter.ConfigOverride[]} */
export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.greasemonkey,
      },
    },
    files: ['src/**/*.js', '*.config.[m]js'],
    rules: {
      '@stylistic/js/semi': ['error', 'always'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/key-spacing': ['error'],
      '@stylistic/js/quote-props': ['error', 'consistent-as-needed'],
      '@stylistic/js/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/js/object-curly-spacing': ['error', 'always'],
    },
  },
  {
    files: ['src/**/*.vue'],
    rules: {
      'vue/max-attributes-per-line': ['error', {
        singleline: { max: 100 },
        multiline: { max: 1 },
      }],
      'vue/multi-word-component-names': ['error', {
        ignores: ['App'],
      }],
    },
  },
];
