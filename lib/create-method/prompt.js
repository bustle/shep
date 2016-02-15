'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (flags, config) {
  var funcs = _glob2.default.sync('functions/*').map(function (path) {
    return path.split('/').pop();
  });
  var resources = config.resources.reduce(function (obj, resource) {
    obj[resource.path] = resource.id;
    return obj;
  }, {});

  return (0, _prompt2.default)([{
    name: 'resourceId',
    type: 'list',
    choices: Object.keys(resources).sort(),
    message: 'Which resource?',
    filter: function filter(input) {
      return resources[input];
    }
  }, {
    name: 'httpMethod',
    type: 'list',
    choices: ['GET', 'POST', 'PUT', 'DELETE'],
    message: 'Which HTTP Method?'
  }, {
    name: 'statusCode',
    default: '200',
    message: 'Default Status Code'
  }, {
    name: 'contentType',
    default: 'application/json',
    message: 'Default content type'
  }, {
    name: 'funcName',
    type: 'list',
    choices: funcs,
    message: 'Which lambda function?'
  }]).then(function (answers) {
    return (0, _index2.default)((0, _lodash.assign)({}, answers, flags), config);
  });
};

var _prompt = require('../util/prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _lodash = require('lodash');

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }