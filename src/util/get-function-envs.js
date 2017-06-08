import Promise from 'bluebird'
import { getEnvironment } from './aws/lambda'

export default function (alias, configs) {
  return Promise.reduce(configs, async (acc, config) => {
    const fullName = config.FunctionName
    try {
      const env = await getEnvironment(alias, { FunctionName: fullName })
      acc[fullName] = env
    } catch (e) {
      acc[fullName] = {}
    }
    return acc
  }, {})
}
