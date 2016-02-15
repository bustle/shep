import AWS from 'aws-sdk'
import Promise from 'bluebird'
import fs from 'fs-extra-promise'
import { assign } from 'lodash'

export default function({apiId, region}){

  if (region){ AWS.config.update({ region }) }

  return require('../util/api-gateway').getResources(apiId)
  .get('items')
  .then((api)=>{
    return fs.writeJsonAsync('api.json', api , { spaces: 2 })
  })
}
