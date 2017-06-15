import lint from '../doctor'

export const command = 'doctor'
export const desc = 'Checks your projects against best standards'
export function builder (yargs) {
  return yargs
  .describe('quiet', 'Don\'t log anything')
  .describe('verbose', 'Logs additional information')
  .default('quiet', false)
  .alias('q', 'quiet')
  .example('shep doctor', 'Runs the doctor on your project')
}

export async function handler (opts) {
  const { warnings, errors } = await lint(opts)
  const log = logger(opts.verbose)

  if (!opts.quiet) { warnings.forEach(log) }
  if (errors.length > 0) {
    if (!opts.quiet) { console.error(errors.join('\n')) }
    process.exit(errors.length)
  }
}

function logger (verbose) {
  return ({ rule, message }) => {
    if (verbose) { console.log(rule) }
    console.log(message + '\n')
  }
}
