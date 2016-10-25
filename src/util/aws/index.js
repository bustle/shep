import AWS from 'aws-sdk'
import Promise from 'bluebird'

AWS.config.setPromisesDependency(Promise)

export default AWS
