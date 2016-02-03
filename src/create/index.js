import reject from 'bluebird'
import contains from 'lodash'

var validCommands = ['project', 'resource'];

export default function(config, [cmd, ...input]){
  if (contains(validCommands, cmd)) {
    return require(`./${cmd}`).default(config, input)
  } else {
    return reject(new Error('That command was not recognized'))
  }
}
