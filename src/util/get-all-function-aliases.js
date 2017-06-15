import Promise from 'bluebird'
import { funcs, lambdaConfig } from './load'
import { listAliases } from './aws/lambda'

export default async function () {
  const funcConfigs = await Promise.map(funcs(), lambdaConfig)
  return Promise.map(funcConfigs, async ({ FunctionName }) => {
    try {
      const aliases = await listAliases(FunctionName)
      return aliases
    } catch (e) {
      if (e.code !== 'ResourceNotFoundException') { throw e }
      return []
    }
  })
}
