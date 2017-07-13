import uploadEnvironment from '../util/upload-environment'

export default function ({ env, vars }) {
  return uploadEnvironment(env, vars)
}
