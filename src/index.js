import * as fs from './modules/fs'
import * as aws from './modules/aws'

import _create from './create'
import _pull from './pull'
import _push from './push'
import _run from './run'
import _deploy from './deploy'
import _build from './build'
import _logs from './logs'
import _generateFunction from './generate-function'
import _generateEndpoint from './generate-endpoint'
import _generateWebpack from './generate-webpack'

export const create = setupCommand(_create)
export const pull = setupCommand(_pull)
export const push = setupCommand(_push)
export const run = setupCommand(_run)
export const deploy = setupCommand(_deploy)
export const build = setupCommand(_build)
export const logs = setupCommand(_logs)
export const generateFunction = setupCommand(_generateFunction)
export const generateEndpoint = setupCommand(_generateEndpoint)
export const generateWebpack = setupCommand(_generateWebpack)
export { version } from '../package.json'

function setupCommand (cmd) {
  const command = cmd.bind(null, { aws, fs })
  return function (opts) {
    if (opts.region) { aws.updateRegion(opts.region) }
    return command(opts)
  }
}
