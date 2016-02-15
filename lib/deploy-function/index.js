'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var name = _ref.name;
  var namespace = _ref.namespace;
  var _ref$env = _ref.env;
  var env = _ref$env === undefined ? {} : _ref$env;

  var funcDir = 'functions/' + name;
  var funcPackage = _fsExtraPromise2.default.readJsonSync(funcDir + '/package.json');
  var rootPackage = _fsExtraPromise2.default.readJsonSync('package.json');
  var lambdaConfig = _fsExtraPromise2.default.readJsonSync(funcDir + '/lambda.json');
  var tmpFuncDir = _path2.default.join(tmpDir, name);
  var tmpFuncZipFile = _path2.default.join(tmpDir, name + '.zip');
  var remoteFuncName = namespace ? namespace + '-' + name : name;

  return _bluebird2.default.all([_fsExtraPromise2.default.removeAsync(tmpFuncDir), _fsExtraPromise2.default.removeAsync(tmpFuncZipFile)]).then(copyFunc).then(writeConfig).then(transpile).then(inheritDeps).then(installDeps).then(zipDir).then(upload);

  function copyFunc() {
    return _fsExtraPromise2.default.copyAsync(funcDir, tmpFuncDir, { dereference: true, filter: function filter(path) {
        return path.indexOf('node_modules') < 0;
      } });
  }

  function transpile() {
    return (0, _glob2.default)(tmpFuncDir + '/**/*.js').map(function (path) {
      return _fsExtraPromise2.default.readFileAsync(path, 'utf8').then(function (file) {
        return babel.transform(file, { presets: ["es2015"] });
      }).get('code').then(function (code) {
        return _fsExtraPromise2.default.writeFileAsync(path, code);
      });
    });
  }

  function writeConfig() {
    return _bluebird2.default.all([_fsExtraPromise2.default.removeAsync(_path2.default.join(tmpFuncDir, 'env.js')), _fsExtraPromise2.default.writeJSONAsync(_path2.default.join(tmpFuncDir, 'env.json'), env)]);
  }

  function inheritDeps() {
    funcPackage.dependencies = _lodash2.default.assign(funcPackage.dependencies, rootPackage.dependencies);
    return _fsExtraPromise2.default.writeJSONAsync(_path2.default.join(tmpFuncDir, 'package.json'), funcPackage);
  }

  function installDeps() {
    return (0, _exec2.default)('npm install --silent --production', { cwd: tmpFuncDir });
  }

  function zipDir() {
    return (0, _exec2.default)('zip -r ' + tmpFuncZipFile + ' *', { cwd: tmpFuncDir });
  }

  function upload() {
    return _bluebird2.default.join(_fsExtraPromise2.default.readFileAsync(tmpFuncZipFile), get(), function (zipFile, remoteFunc) {
      if (remoteFunc) {
        return _bluebird2.default.all([updateCode(zipFile), updateConfig()]).get(0);
      } else {
        return create(zipFile);
      }
    });

    function create(ZipFile) {
      var params = _lodash2.default.clone(lambdaConfig);

      params.Code = { ZipFile: ZipFile };
      params.FunctionName = remoteFuncName;
      params.Runtime = 'nodejs';

      return lambda.createFunc(params).tap(function () {
        return console.log('Created ' + remoteFuncName + ' on AWS');
      });
    }

    function get() {
      return lambda.getFunc({ FunctionName: remoteFuncName }).catch(function (err) {
        if (err.code === 'ResourceNotFoundException') {
          return _bluebird2.default.resolve();
        } else {
          return _bluebird2.default.reject(err);
        }
      });
    }

    function updateCode(ZipFile) {
      var params = { ZipFile: ZipFile, FunctionName: remoteFuncName };
      return lambda.updateFuncCode(params);
    }

    function updateConfig() {
      var params = _lodash2.default.clone(lambdaConfig);
      params.FunctionName = remoteFuncName;
      return lambda.updateFuncConfig(params);
    }
  }
};

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _lambda = require('../util/lambda');

var lambda = _interopRequireWildcard(_lambda);

var _fsExtraPromise = require('fs-extra-promise');

var _fsExtraPromise2 = _interopRequireDefault(_fsExtraPromise);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _os = require('os');

var _exec = require('../util/exec');

var _exec2 = _interopRequireDefault(_exec);

var _babelCore = require('babel-core');

var babel = _interopRequireWildcard(_babelCore);

var _glob = require('../util/glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tmpDir = (0, _os.tmpdir)();