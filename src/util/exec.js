const { promisify } = require('bluebird')
const { exec } = require('child_process')

module.exports = promisify(exec)
