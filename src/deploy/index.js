import build from '../util/build-functions'
import upload from '../util/upload-functions'
import uploadBuilds from '../util/upload-builds'
import { deploy } from '../util/aws/api-gateway'
import promoteAliases from '../util/promote-aliases'
import setPermissions from '../util/set-permissions'
import * as load from '../util/load'
import push from '../util/push-api'
import AWS from 'aws-sdk'
import listr from '../util/modules/listr'

export default function (opts) {
  const functions = opts.functions || '*'
  const env = opts.env || 'development'
  const region = opts.region
  const bucket = opts.bucket
  const performBuild = opts.build
  const api = load.api()

  let apiId, uploadFuncs
  let shouldUpload = true

  if (opts.apiId) { apiId = opts.apiId }

  AWS.config.update({ region })

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
      title: `Upload Builds to S3`,
      task: () => uploadBuilds(functions, bucket).tap((funcs) => {
        // delete null keys from fns without s3 builds, then set other fns to be uploaded

        Object.keys(funcs).forEach((key) => (funcs[key] == null) && delete funcs[key])

        if (Object.keys(funcs).length === 0) { shouldUpload = false }
        uploadFuncs = funcs
      })
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
  ], opts.quiet)

  if (api) {
    tasks.add([
      {
        title: 'Upload API.json',
        task: () => push(api, apiId, region).tap((id) => { apiId = id })
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

  return tasks.run()
  .then(() => {
    if (apiId) { console.log(`API URL: https://${apiId}.execute-api.${region}.amazonaws.com/${env}`) }
  })
}
