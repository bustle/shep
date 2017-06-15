import build from '../util/build-functions'
import upload from '../util/upload-functions'
import uploadBuilds from '../util/upload-builds'
import { deploy } from '../util/aws/api-gateway'
import promoteAliases from '../util/promote-aliases'
import setPermissions from '../util/set-permissions'
import * as load from '../util/load'
import push from '../util/push-api'
import listr from '../util/modules/listr'

export default async function (opts) {
  const functions = opts.functions || '*'
  const env = opts.env || 'development'
  const region = opts.region
  const bucket = opts.bucket
  const performBuild = opts.build
  const api = await load.api()
  const quiet = opts.quiet === undefined ? true : opts.quiet

  let apiId, uploadFuncs
  let shouldUpload = true

  if (opts.apiId) { apiId = opts.apiId }

  const tasks = listr([
    {
      title: `Build Functions`,
      task: () => build(functions, env),
      skip: () => {
        if (performBuild === false) {
          return 'Called with --no-build'
        }
      }
    },
    {
      // this should only be ran if bucket is present
      title: `Upload Builds to S3`,
      task: async () => {
        const funcs = await uploadBuilds(functions, bucket)
        // delete null keys from fns without s3 builds, then set other fns to be uploaded

        Object.keys(funcs).forEach((key) => (funcs[key] == null) && delete funcs[key])

        if (Object.keys(funcs).length === 0) { shouldUpload = false }
        uploadFuncs = funcs
      },
      skip: async () => {
        if (!bucket) {
          // need to set uploaded funcs
          uploadFuncs = await load.funcs(functions)
          return 'Skipping uploading builds, no S3 bucket provided'
        }
      }
    },
    {
      title: 'Upload Functions to AWS',
      task: () => upload(uploadFuncs, env),
      skip: () => {
        if (!shouldUpload) {
          return 'Skipping upload, function unchanged since last deploy'
        }
      }
    }
  ], quiet)

  if (api) {
    tasks.add([
      {
        title: 'Upload API.json',
        task: async () => {
          apiId = await push(api, apiId, region)
        }
      }
    ])
  }

  tasks.add([
    {
      title: 'Promote Function Aliases',
      task: () => promoteAliases(functions, env)
    }
  ])

  if (api) {
    tasks.add([
      {
        title: 'Setup Lambda Permissions',
        task: () => setPermissions(api, apiId, env)
      },
      {
        title: 'Deploy API',
        task: () => deploy(apiId, env)
      }
    ])
  }

  await tasks.run()
  if (apiId && !quiet) { console.log(`API URL: https://${apiId}.execute-api.${region}.amazonaws.com/${env}`) }
  return `https://${apiId}.execute-api.${region}.amazonaws.com/${env}`
}
