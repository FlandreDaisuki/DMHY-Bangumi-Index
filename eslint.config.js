import flandre from '@flandredaisuki/eslint-config';

export default flandre({
  languageOptions: {
    globals: {
      unsafeWindow: 'readonly',
      GM_xmlhttpRequest: 'readonly',
    },
  },
});
