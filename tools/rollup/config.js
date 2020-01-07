const path = require('path');
const buble = require('rollup-plugin-buble');
const typescript = require('rollup-plugin-typescript');
const pkg = require('../../package.json')

const resolveFile = function(filePath) {
  return path.join(__dirname, '../..', filePath)
}

module.exports = [
  {
    input: resolveFile('src/index.ts'),
    output: {
      file: resolveFile(pkg.main),
      // format: 'cjs',   // node
      // format: 'iife',  // web
      format: 'umd',      // node + web
      name: 'node_universal_loggly',
    },
    plugins: [
      typescript(),
      buble(),
    ],
  },
]
