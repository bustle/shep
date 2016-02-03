'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (questions) {
  return new _bluebird.Promise(function (resolve) {
    _inquirer2.default.prompt(questions, resolve);
  });
};

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _bluebird = require('bluebird');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }