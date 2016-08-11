import fs from '../util/fs'
import { getExport } from '../util/api-gateway'
import { update } from '../util/shep-config'
import AWS from 'aws-sdk'

export default function(opts) {
  AWS.config.update({region: opts.region})

  const params = {
    restApiId: opts.apiId,
    stageName: opts.stage,
    exportType: 'swagger',
    accepts: 'json',
    parameters: {
      extensions: 'integrations,authorizers'
    }
  }

  return getExport(params)
  .get('body')
  .tap(() => update({ apiId: opts.apiId, region: opts.region }))
  .then((api) => fs.writeFileAsync(opts.output || 'api.json', api))
}
