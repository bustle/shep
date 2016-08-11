import loadFuncs from '../util/load-funcs'
import build from '../util/build-function'
import Promise from 'bluebird'
import { queue, done } from '../util/tasks'

export default function(opts) {

  const functions = loadFuncs(opts.functions)
  const env = opts.env || 'development'
  const concurrency = opts.concurrency || Infinity

  return Promise.resolve(functions)
  .tap((funcs) => funcs.map(queue))
  .map((func) => build(func, env).tap(() => done(func)), { concurrency })
}
