#! /usr/bin/env node

import meow from 'meow'
import shepherd from './index'
const cli = meow(
`
    Usage
      $ shepherd create project
      $ shepherd create function
      $ shepherd deploy

    Options
      -r, --rainbow  Include a rainbow
`
)

// const checkCwd = require('./util/check-cwd');
//
// if (args._[0] !== 'new' && args._[0] !== 'help' ) { checkCwd(); }

shepherd(cli)
