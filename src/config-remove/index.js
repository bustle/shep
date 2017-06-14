import remove from '../util/remove-environment'
import listr from '../util/modules/listr'

export default function (opts) {
  const env = opts.env || 'development'

  const tasks = listr([
    {
      title: 'Remove environment variables on functions in AWS',
      task: () => remove(env, opts.vars)
    }
  ])

  return tasks.run()
}
