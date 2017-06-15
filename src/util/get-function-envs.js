import Promise from 'bluebird'
import { getEnvironment } from './aws/lambda'

export default function (alias, configs) {
  return Promise.map(configs, async (config) => {
    const fullName = config.FunctionName

    let env
    try {
      env = await getEnvironment(alias, { FunctionName: fullName })
    } catch (e) {
      env = null
    }
    return { fullName, env }
  })
  .reduce((acc, { fullName, env }) => {
    if (env !== null) { acc[fullName] = env }
    return acc
  }, {})
}
