import remove from '../util/remove-environment'

export default function ({ env = 'development', vars }) {
  return remove(env, vars)
}
