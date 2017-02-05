import exec from './modules/exec'
import { pkg } from './load'

export default async function (PATTERN, NODE_ENV) {
  const { shep } = pkg()
  const buildCommand = shep && shep.buildCommand || 'webpack --bail'
  try {
    return await exec(buildCommand, { env: { ...process.env, PATTERN, NODE_ENV } })
  } catch (e) {
    console('BOOOOM')
    if (e.code === 'ENOENT') {
      console.warn('No locally installed webpack found. Verify that webpack is installed')
    }
    throw e
  }
}
