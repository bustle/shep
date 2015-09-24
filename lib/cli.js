#! /usr/bin/env node
const shepherd = require('./index');
const args = require('minimist')(process.argv.slice(2));
const checkCwd = require('./util/check-cwd');

if (args._[0] !== 'new' && args._[0] !== 'help' ) { checkCwd(); }
shepherd(args).done();
