#! /usr/bin/env node
'use strict';

var _meow = require('meow');

var _meow2 = _interopRequireDefault(_meow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cli = (0, _meow2.default)('\n    Usage\n      $ shepherd create project\n      $ shepherd create project --no-api\n      $ shepherd create function\n      $ shepherd deploy\n\n    Options\n      -r, --rainbow  Include a rainbow\n');

run(cli);

function run(_ref) {
  var input = _ref.input;
  var flags = _ref.flags;

  require('./' + input.join('/')).default(flags);
}

// import { reject } from 'bluebird'
// import { contains, assign } from 'lodash'
// import { readJsonSync } from 'fs-extra'
// import AWS from 'aws-sdk'
//
// function shepherd({input: [cmd, ...input], flags}){
//   if (contains(validCommands, cmd)) {
//     let config = {}
//     if (input[0] !== 'project') {
//       config = assign(config, readJsonSync('api.json'))
//       AWS.config.update({region: config.region})
//     }
//     return require(`./${cmd}`).default(config, input, flags)
//   } else {
//     return reject(new Error('That command was not recognized'));
//   }
// }
//
// module.exports = shepherd
// shepherd(cli)