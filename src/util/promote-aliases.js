import { setAlias } from '../modules/aws/lambda'
import Promise from 'bluebird'

export default function (funcs, env) {
  return Promise.resolve(funcs)
  .map((func) => setAlias(func, env))
}
