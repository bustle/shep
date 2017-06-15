import generateWebpack from '../../generate-webpack'

export const command = 'webpack'
export const desc = 'Generates a webpack.config.js with default template'
export function builder (yargs) {
  return yargs
  .pkgConf('shep', process.cwd())
  .boolean('quiet')
  .alias('quiet', 'q')
  .describe('quiet', 'Don\'t log anything')
  .describe('output', 'Output file')
  .alias('output', 'o')
  .default('output', 'webpack.config.js')
  .example('shep generate webpack -o foo.js', 'Writes default webpack configuration to foo.js')
}

export const handler = generateWebpack
