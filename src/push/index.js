import push from '../util/push-api'
import * as load from '../util/load'
import listr from '../util/modules/listr'

export default async function (opts) {
  const apiId = opts.apiId
  const region = opts.region
  const api = await load.api()

  const tasks = listr([
    {
      title: `Upload api.json to AWS`,
      task: () => push(api, apiId, region)
    }
  ], opts.quiet)

  return tasks.run()
}
