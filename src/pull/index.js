import { writeFile } from '../util/modules/fs'
import { exportStage } from '../util/aws/api-gateway'
import { update } from '../util/pkg-config'
import AWS from 'aws-sdk'
import listr from '../util/modules/listr'

export default function (opts) {
  const apiId = opts.apiId
  const stage = opts.stage
  const region = opts.region

  AWS.config.update({region: opts.region})

  let exportedApi

  const tasks = listr([
    {
      title: `Export API currenly on ${stage}`,
      task: async () => {
        exportedApi = await exportStage(apiId, stage)
        return update({ apiId, region })
      }
    },
    {
      title: 'Write to api.json',
      task: () => writeFile('api.json', exportedApi, { spaces: 2 })
    }
  ], opts.quiet)

  return tasks.run()
}
