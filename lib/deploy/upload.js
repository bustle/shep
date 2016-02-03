'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (funcDir, namespace, envConfig) {
  var funcPackage = _fsExtraPromise2.default.readJsonSync(_path2.default.join(funcDir, 'package.json'));
  var rootPackage = _fsExtraPromise2.default.readJsonSync('package.json');
  var lambdaConfig = _fsExtraPromise2.default.readJsonSync(_path2.default.join(funcDir, 'lambda.json'));
  var packagedFuncDir = _path2.default.join(tmpDir, funcPackage.name);
  var zippedFunc = _path2.default.join(tmpDir, funcPackage.name + '.zip');
  var remoteFuncName = namespace + funcPackage.name;

  return _bluebird2.default.all([_fsExtraPromise2.default.removeAsync(packagedFuncDir), _fsExtraPromise2.default.removeAsync(zippedFunc)]).then(copyFunc).then(writeConfig).then(transpile).then(inheritDeps).then(installDeps).then(zipDir).then(upload);

  function copyFunc() {
    return _fsExtraPromise2.default.copyAsync(funcDir, packagedFuncDir, { dereference: true, filter: function filter(path) {
        return path.indexOf('node_modules') < 0;
      } });
  }

  function transpile() {
    return (0, _glob2.default)(packagedFuncDir + '/**/*.js').map(function (path) {
      return _fsExtraPromise2.default.readFileAsync(path, 'utf8').then(function (file) {
        return babel.transform(file, { presets: ["es2015"] });
      }).get('code').then(function (code) {
        return _fsExtraPromise2.default.writeFileAsync(path, code);
      });
    });
  }

  function writeConfig() {
    return _bluebird2.default.all([_fsExtraPromise2.default.removeAsync(_path2.default.join(packagedFuncDir, 'env.js')), _fsExtraPromise2.default.writeJSONAsync(_path2.default.join(packagedFuncDir, 'env.json'), envConfig)]);
  }

  function inheritDeps() {
    funcPackage.dependencies = _lodash2.default.assign(funcPackage.dependencies, rootPackage.dependencies);
    return _fsExtraPromise2.default.writeJSONAsync(_path2.default.join(funcDir, 'package.json'), funcPackage);
  }

  function installDeps() {
    return (0, _exec2.default)('npm install --silent --production', { cwd: packagedFuncDir });
  }

  function zipDir() {
    return (0, _exec2.default)('zip -r ' + zippedFunc + ' *', { cwd: packagedFuncDir });
  }

  function upload() {

    return _bluebird2.default.join(_fsExtraPromise2.default.readFileAsync(zippedFunc), get(), function (zipFile, remoteFunc) {
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

      return lambda.createFunc(params);
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