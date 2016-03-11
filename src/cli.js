#! /usr/bin/env node
import meow from 'meow'
import pkgConf from 'pkg-conf'
import AWS from 'aws-sdk'
import fs from 'fs-extra-promise'

const cli = meow(
`
    Usage
      $ shepherd new
      $ shepherd new --no-api
      $ shepherd create-function
      $ shepherd deploy

    Options
      -r, --rainbow  Include a rainbow
`
)

let config
try {
  config = pkgConf.sync('shepherd')
  config.babelConfig = pkgConf.sync('babel')
  AWS.config.update({region: config.region })
} catch (e){
  config = {}
}

try {
  config.resources = fs.readJSONSync('api.json')
} catch (e){
}

run(cli)

function run({ input, flags }){
  require(`./${input.join('/')}/prompt`).default(flags, config)
}
