const buble = require('rollup-plugin-buble')
const typescript = require('rollup-plugin-typescript')

module.exports = [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/vue-web-storage-with-fallback.esm.js',
      format: 'es'
    },
    plugins: [
      typescript(),
      buble()
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/vue-web-storage-with-fallback.js',
      format: 'umd',
      name: 'WebStorageWithFallback'
    },
    plugins: [
      typescript(),
      buble(),
    ]
  }
]
