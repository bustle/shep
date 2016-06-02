import fs from 'fs-extra-promise'
import { merge } from 'lodash'

export default function(name){
  const functionLambda = fs.readJsonSync(`functions/${name}/lambda.json`)
  const projectLambda = fs.readJsonSync('lambda.json')

  return merge({}, projectLambda, functionLambda)
}
