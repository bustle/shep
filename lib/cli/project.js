#! /usr/bin/env node
'use strict';

var _meow = require('meow');

var _meow2 = _interopRequireDefault(_meow);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cli = (0, _meow2.default)('\n    Usage\n      $ shepherd create project\n      $ shepherd create project --no-api\n      $ shepherd create function\n      $ shepherd deploy\n\n    Options\n      -r, --rainbow  Include a rainbow\n');

(0, _index2.default)(cli);