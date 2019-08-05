import fs from 'fs';

import commonjs from 'rollup-plugin-commonjs';
import vue from 'rollup-plugin-vue';
import metablock from 'rollup-plugin-userscript-metablock';

// prevent absolute path in script
process.env.NODE_ENV = 'production';

const pkg = JSON.parse(fs.readFileSync('package.json'));
const external = ['vue', 'vuex', 'vue-router', 'js-yaml', 'lz-string'];
const globals = {
  vue: 'Vue',
  vuex: 'Vuex',
  'vue-router': 'VueRouter',
  'js-yaml': 'jsyaml',
  'lz-string': 'LZString',
};

export default {
  input: 'src/index.js',
  external,
  plugins: [
    commonjs(),
    vue(),
    metablock({
      file: 'src/metablock.yml',
      override: {
        version: pkg.version,
      },
    }),
  ],

  output: {
    file: 'dist/dmhy-bangumi-index.user.js',
    format: 'iife',
    globals,
  },
};
