const { camelCase, assign } = require('lodash')
const readPkgUp = require('read-pkg-up')
const AWS = require('aws-sdk')

const printHelp = require('./util/print-help')
const fs = require('./util/fs')
const prompt = require('./util/prompt')
const validateFlags = require('./util/validate-flags')
const missingFlags = require('./util/missing-flags')

const shepVersion = require('../package.json').version

const validCommands = [
  'new',
  'pull',
  'run',
  'deploy',
  'deploy-function',
  'create-resource',
  'create-method',
  'create-function'
]

let config, pkg, api

try {
  pkg = readPkgUp.sync({cwd: process.cwd()})
  config = pkg.pkg.shep || {}
  AWS.config.update({ region: config.region })
} catch (e){
  config = {}
}

try { api = fs.readJSONSync('api.json') } catch (e){}

validCommands.map((cmd) => { module.exports[camelCase(cmd)] = buildCmd(require(`./${cmd}`)) })

function buildCmd({ helpText, opts, exec }){

  return function(flags = {}){
    const optsWithContext = opts(flags, api, config)

    if (flags.debug){ console.log( 'version:', shepVersion )}

    if (flags.help){
      return printHelp(helpText, optsWithContext)
    } else {
      return validateFlags(flags, optsWithContext)
      .then(generatePrompts)
      .then((prompts) => {
        if (flags.interactive === false && prompts.length !== 0){
          return missingFlags(prompts)
        } else {
          return prompt(prompts)
        }
      })
      .then((answers) => [ assign({}, config, answers, flags), api, pkg.pkg ] )
      .spread(exec)
    }

    function generatePrompts(prompts){
      return prompts
      .filter((prompt) => flags[prompt.name] === undefined )
      .filter((prompt) => prompt.when ? prompt.when() : true)
    }
  }
}
