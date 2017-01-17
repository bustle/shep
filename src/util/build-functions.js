import exec from './modules/exec'
import { pkg } from './load'

export default function (PATTERN, NODE_ENV) {
  const buildCommand = pkg().shep && pkg().shep.buildCommand ? pkg().shep.buildCommand : 'webpack --bail'
  const [command, args] = parseBuildCommand(buildCommand)
  return exec(command, args, { env: { PATTERN, NODE_ENV } })
  .catch({ code: 'ENOENT' }, (e) => {
    console.warn('No locally installed webpack found. Verify that webpack is installed')
    throw e
  })
}

function parseBuildCommand (command) {
  const [com, ...args] = command.split(' ')
  return [com, args]
}
