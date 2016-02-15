'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (flags) {

  return (0, _prompt2.default)([{
    name: 'name',
    message: 'API name?',
    default: 'api.example.com'
  }, {
    name: 'folder',
    message: 'Project folder?',
    default: function _default(answers) {
      return answers.name;
    }
  }, {
    name: 'namespace',
    message: 'Lambda function namespace?',
    default: function _default(answers) {
      return _lodash2.default.kebabCase(answers.name) + "-";
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
    }
  }]).then(createProjectFolder).then(createApi).then(createDirectories).then(createFiles).then(execPull);

  function execPull(params) {
    return (0, _exec2.default)('shepherd pull', { cwd: params.folder });
  }

  function createApi(params) {
    _awsSdk2.default.config.update({ region: params.region });
    var apiGateway = new _awsSdk2.default.APIGateway();
    console.log('Creating API on AWS...');

    return new _bluebird2.default(function (resolve, reject) {
      apiGateway.createRestApi({ name: params.name }, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    }).then(function (_ref) {
      var id = _ref.id;

      return _lodash2.default.assign(params, { id: id });
    });
  }

  function createProjectFolder(params) {
    console.log('Creating Project Folder...');
    return _fsExtraPromise2.default.mkdirAsync(params.folder).return(params);
  }

  function createDirectories(params) {
    return _fsExtraPromise2.default.mkdirAsync(params.folder + '/functions').return(params);
  }

  function createFiles(params) {
    return _bluebird2.default.all([_fsExtraPromise2.default.writeJSONAsync(params.folder + '/api.json', { name: params.name, region: params.region, id: params.id, functionNamespace: params.namespace, accountId: params.accountId }), _fsExtraPromise2.default.writeJSONAsync(params.folder + '/package.json', { name: params.name, devDependencies: { 'babel-preset-es2015': "^6.3.13" }, babel: { "presets": ["es2015"] } }), _fsExtraPromise2.default.writeFileAsync(params.folder + '/env.js.example', "module.exports = { beta: { env: 'beta', secret: 'beta-key' }, production: { env: 'production', secret: 'prod-key'} }"), _fsExtraPromise2.default.writeFileAsync(params.folder + '/.gitignore', 'node_modules/*\nenv.js'), _fsExtraPromise2.default.writeFileAsync(params.folder + '/README.md', '#' + params.name), _fsExtraPromise2.default.writeJSONAsync(params.folder + '/.jshintrc', {
      "node": true,
      "esnext": true,
      "eqeqeq": true,
      "indent": 2,
      "latedef": "nofunc",
      "newcap": true,
      "undef": true,
      "unused": true,
      "mocha": true,
      "asi": true,
      "predef": ["-Promise"]
    })]).return(params);
  }
};

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _prompt = require('../util/prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fsExtraPromise = require('fs-extra-promise');

var _fsExtraPromise2 = _interopRequireDefault(_fsExtraPromise);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _exec = require('../util/exec');

var _exec2 = _interopRequireDefault(_exec);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ApiQuestions = [];