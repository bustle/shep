import push from '../util/push-api'
import * as load from '../util/load'
import listr from '../modules/listr'
import AWS from 'aws-sdk'

export default function (opts) {
  AWS.config.update({region: opts.region})

  const apiId = opts.apiId
  const region = opts.region
  const api = load.api()

  const tasks = listr([
    {
      title: `Upload api.json to AWS`,
      task: () => push(api, apiId, region)
    }
  ], opts.quiet)

  return tasks.run()
}
