import push from '../util/push-api'
import * as load from '../util/load'
import listr from '../util/modules/listr'

export default async function ({ apiId, region, quiet = true }) {
  const api = await load.api()

  const tasks = listr([
    {
      title: `Upload api.json to AWS`,
      task: () => push(api, apiId, region)
    }
  ], quiet)

  return tasks.run()
}
