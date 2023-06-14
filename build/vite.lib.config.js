import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
const terser = require("@rollup/plugin-terser").default

export default defineConfig({
  plugins: [
    vue(),
    terser()
  ],
  build: {
    lib: {
      entry: path.join(__dirname, '..', 'packages/index.js'),
      name: 'tpl-editor',
      fileName: (format) => `tpl-editor.${format}.js`,
    },
    rollupOptions: {
      external: Object.keys(require('../package.json').peerDependencies),
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
