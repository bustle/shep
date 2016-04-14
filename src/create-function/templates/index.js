let templates = {}

templates.index = require('./_index')
templates.event = require('./event')
templates.lambda = require('./lambda')
templates.package = require('./package')

module.exports = templates
