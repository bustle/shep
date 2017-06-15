import { writeFile } from '../util/modules/fs'
import { exportStage } from '../util/aws/api-gateway'
import { update } from '../util/pkg-config'
import AWS from 'aws-sdk'
import listr from '../util/modules/listr'

export default function ({ apiId, stage, region, quiet = true }) {
  AWS.config.update({ region })

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
  ], quiet)

  return tasks.run()
}
