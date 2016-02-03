'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _child_process = require('child_process');

exports.default = (0, _bluebird.promisify)(_child_process.exec);