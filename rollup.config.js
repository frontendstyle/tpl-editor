const path = require("path")
const dataSass = require('sass')
const { defineConfig } = require('rollup')
const commonjs = require('@rollup/plugin-commonjs')
// const esbuild = require('rollup-plugin-esbuild').default
const terser = require("@rollup/plugin-terser").default
const babel = require('@rollup/plugin-babel').default
const alias = require('@rollup/plugin-alias')
const strip = require('@rollup/plugin-strip')
const resolve = require('@rollup/plugin-node-resolve')
const vue = require('rollup-plugin-vue')
const scss = require('rollup-plugin-scss')
// const postcss = require('rollup-plugin-postcss')
// const autoprefixer = require('autoprefixer')


const extensions = ['.mjs', '.js', '.json', '.ts', '.vue']
module.exports = defineConfig({
  input: 'packages/index.js',
  output: [{
    globals: {
      vue: 'Vue'
    },
    name: 'tpl-editor',
    file: 'dist/tpl-editor.js',
    format: 'umd',
    plugins: [terser(), strip()]
  }, {
    name: 'tpl-editor',
    file: 'dist/tpl-editor.esm.js',
    format: 'es',
    plugins: [terser(), strip()]
  }],
  external: ['vue'],
  plugins: [
    vue({
      include: /\.vue$/,
    }),
    resolve({
      extensions,
      exclude: '**/node_modules/**'
    }),
    scss({ include: /\.scss$/, fileName:"style.css", outputStyle: "compressed" }),
    // esbuild({
    //   include: /\.js$/,
    //   minify: process.env.NODE_ENV === 'production',
    //   target: 'es2015'
    // }),
    babel({
      exclude: "node_modules/**",
      extensions,
      babelHelpers: 'bundled'
    }),
    commonjs({
      sourceMap: false
    }),
    terser(),
    alias({
      entries: [
        {
          find: '~', // 别名名称，作为依赖项目需要使用项目名
          replacement: path.resolve(__dirname, 'packages'),
          customResolver: resolve({
            extensions: ['.cjs', '.js', '.jsx', '.vue', '.sass', '.scss']
          })
        }
      ]
    }),
    strip(),
  ],
})
