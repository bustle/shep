'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (config) {
  return (0, _prompt2.default)([{
    name: 'name',
    message: 'Function name?',
    validate: function validate(input) {
      return (/^[a-zA-Z0-9-_]+$/.test(input) ? true : 'Function name must contain only letters, numbers, hyphens, or underscores'
      );
    }
  }, {
    name: 'role',
    message: 'Lambda execution role. This must already exist. See your IAM console for details'
  }]).then(createDir).then(createFiles).then(createOnAWS);

  function createOnAWS(params) {
    return (0, _upload2.default)('functions/' + params.name, config.functionNamespace);
  }

  function createDir(params) {
    return _fsExtraPromise2.default.mkdirAsync('functions/' + params.name).return(params);
  }

  function createFiles(params) {
    return _bluebird2.default.all([createIndexJS(params), createPackageJSON(params), createGitIgnore(params), createLambdaConfig(params), createEventJSON(params), createConfig(params)]).return(params);
  }

  function createIndexJS(params) {
    var content = '\nimport env from \'./env\'\n\nexport function handler({ headers, pathParameters, queryParameters, body }, context) {\n  // Replace below with your own code!\n  context.succeed({ headers, pathParameters, queryParameters, body })\n}';
    return _fsExtraPromise2.default.writeFileAsync('functions/' + params.name + '/index.js', content);
  }

  function createPackageJSON(params) {
    var content = {
      name: params.name,
      version: '0.0.1',
      description: '',
      main: 'index.js',
      scripts: {
        'test': 'echo \"Error: no test specified\" && exit 1'
      },
      author: '',
      dependencies: {}
    };
    return _fsExtraPromise2.default.writeJSONAsync('functions/' + params.name + '/package.json', content);
  }

  function createGitIgnore(params) {
    var content = 'node_modules/*';
    return _fsExtraPromise2.default.writeFileAsync('functions/' + params.name + '/.gitignore', content);
  }

  function createEventJSON(params) {
    var content = { key: 'value' };
    return _fsExtraPromise2.default.writeJSONAsync('functions/' + params.name + '/event.json', content);
  }

  function createConfig(params) {
    var content = '\nimport { development } from \'../../env\'\nexport default development';
    return _fsExtraPromise2.default.writeFileAsync('functions/' + params.name + '/env.js', content);
  }

  function createLambdaConfig(params) {
    var content = {
      Handler: 'index.handler',
      MemorySize: 128,
      Role: params.role,
      Timeout: 3
    };
    return _fsExtraPromise2.default.writeJSONAsync('functions/' + params.name + '/lambda.json', content);
  }
};

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _prompt = require('../util/prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _fsExtraPromise = require('fs-extra-promise');

var _fsExtraPromise2 = _interopRequireDefault(_fsExtraPromise);

var _upload = require('../deploy/upload');

var _upload2 = _interopRequireDefault(_upload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }