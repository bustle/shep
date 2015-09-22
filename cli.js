#! /usr/bin/env node
const shepherd = require('./index');
const args = require('minimist')(process.argv.slice(2));
shepherd(args).done();
