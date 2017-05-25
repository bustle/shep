import * as load from '../util/load'
import { getEnvironment } from '../util/aws/lambda'
import generateName from '../util/generate-name'

export default async function ({ env }) {
  const fns = await load.funcs()
  const { fullName } = generateName(fns.pop())
  const envVars = await getEnvironment(env, { FunctionName: fullName })
  console.log(JSON.stringify(envVars, undefined, 2))
}
