'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (flags) {
  return (0, _prompt2.default)([{
    name: 'apiName',
    message: 'API name?',
    default: 'api.example.com',
    when: function when() {
      return flags.api !== false;
    }
  }, {
    name: 'folder',
    message: 'Project folder?',
    default: function _default(answers) {
      return answers.apiName;
    }
  }, {
    name: 'functionNamespace',
    message: 'Lambda function namespace?',
    default: function _default(answers) {
      return answers.apiName ? _lodash2.default.kebabCase(answers.name) : null;
    },
    validate: function validate(input) {
      return (/^[a-zA-Z0-9-_]+$/.test(input) ? true : 'Namespace must contain only letters, numbers, hyphens, or underscores'
      );
    }
  }, {
    name: 'region',
    message: 'AWS region?',
    default: 'us-east-1'
  }, {
    name: 'accountId',
    message: 'AWS Account ID? NOT your secret key or access key',
    validate: function validate(input) {
      return (/^[0-9]+$/.test(input) ? true : 'AWS Account ID must contain only numbers'
      );
    },
    when: function when() {
      return flags.api !== false;
    }
  }]);
  then(function (config) {});
};

var _prompt = require('../../util/prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }