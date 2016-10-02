import listr from '../util/modules/listr'
import build from '../util/build-functions'

export default function(opts) {

  const functions = opts.functions || '*'
  const env = opts.env || 'development'

  const tasks = listr([
    {
      title: `Build Functions`,
      task: () => build(functions, env)
    }
  ], opts.quiet)

  return tasks.run()

}
