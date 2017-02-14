import AWS from 'aws-sdk'
import Promise from 'bluebird'

AWS.config.setPromisesDependency(Promise)

export { AWS }

export function updateRegion (region) {
  AWS.config.update({region})
}
