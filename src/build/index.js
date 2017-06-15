import build from '../util/build-functions'

export default function ({ functions = '*', env = 'development' }) {
  return build(functions, env)
}
