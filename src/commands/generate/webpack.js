import generateWebpack from '../../generate-webpack'

export const command = 'webpack'
export const desc = 'Generates a webpack.config.js with default template'
export function builder (yargs) {
  return yargs
  .pkgConf('shep', process.cwd())
  .describe('output', 'Output file')
  .alias('output', 'o')
  .default('output', 'webpack.config.js')
}

export const handler = generateWebpack

