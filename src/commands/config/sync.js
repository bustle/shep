import sync from '../../config-sync'

export const command = 'sync'
export const desc = 'Syncs environments across all functions on a shep project'
export function builder (yargs) {
  return yargs
  .pkgConf('shep', process.cwd())
  .describe('env', 'Environment to sync')
  .alias('e', 'env')
  .example('shep config sync', 'Syncs all environments')
  .example('shep config sync --env beta', 'Syncs `beta` environment')
}

export async function handler (opts) {
  return sync(opts.env)
}
