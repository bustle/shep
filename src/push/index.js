import { putRestApi, importRestApi } from '../util/api-gateway'
import requireProject from '../util/require-project'
import { update } from '../util/shep-config'
import observatory from 'observatory'
import { props, all } from 'bluebird'
import AWS from 'aws-sdk'

/**
 * @param opts Options for this command.
 * @param opts.region AWS region.
 * @param opts.apiId The ID of the AWS API Gateway to update.
 */
export default function(opts){
  AWS.config.update({region: opts.region})
  const api = requireProject(`api.json`)

  return pushApi(api, opts.apiId)
  .tap(({ task, result }) => {
    task.details(`https://console.aws.amazon.com/apigateway/home?region=${opts.region}#/apis/${result.id}/resources`)
    task.done('Success!')
  })
  .tap(({ result }) => update({ apiId: result.id, region: opts.region }) )
}

function pushApi(api, id){
  let params = {
    body: JSON.stringify(api),
    failOnWarnings: true
  }

  if (id){
    params.mode = 'overwrite'
    params.restApiId = id
    return props({
      result: putRestApi(params),
      task: observatory.add(`Updating API (${id})`)
    })
  } else {
    return props({
      result: importRestApi(params),
      task: observatory.add(`Creating new API`)
    })
  }
}
