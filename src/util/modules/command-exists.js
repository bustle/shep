import commandExists from 'command-exists'
import Promise from 'bluebird'

export default Promise.promisify(commandExists)
