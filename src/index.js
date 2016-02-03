import { reject } from 'bluebird'
import { contains, assign } from 'lodash'
import { readJsonSync } from 'fs-extra'
import AWS from 'aws-sdk'

const validCommands = ['create','push','deploy','run', 'pull']

function shepherd({input: [cmd, ...input], flags}){
  if (contains(validCommands, cmd)) {
    let config = {}
    if ( input[0] !== 'project') {
      config = assign(config, readJsonSync('api.json'))
      AWS.config.update({region: config.region})
    }
    return require(`./${cmd}`).default(config, input, flags)
  } else {
    return reject(new Error('That command was not recognized'));
  }
}

module.exports = shepherd
