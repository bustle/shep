const glob = require('glob')
const { promisify } = require('bluebird')

module.exports = promisify(glob)
