#! /usr/bin/env node
'use strict';

var _meow = require('meow');

var _meow2 = _interopRequireDefault(_meow);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cli = (0, _meow2.default)('\n    Usage\n      $ shepherd create project\n      $ shepherd create function\n      $ shepherd deploy\n\n    Options\n      -r, --rainbow  Include a rainbow\n');

// const checkCwd = require('./util/check-cwd');
//
// if (args._[0] !== 'new' && args._[0] !== 'help' ) { checkCwd(); }

(0, _index2.default)(cli);