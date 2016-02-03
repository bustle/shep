'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (api) {

  var funcs = _glob2.default.sync('functions/*/');
  var env = require(_path2.default.join(process.cwd(), 'env.js'));
  var apiGateway = new _awsSdk2.default.APIGateway();
  var lambda = new _awsSdk2.default.Lambda();

  var envConfig = undefined,
      envName = undefined;

  return (0, _prompt2.default)([{
    name: 'envName',
    type: 'list',
    choices: Object.keys(env),
    message: 'Which environment?'
  }]).then(function (params) {
    envConfig = env[params.envName];
    envName = params.envName;
  }).return(funcs).tap(function () {
    console.log("Packaging functions...");
  }).map(function (dir) {
    return (0, _upload2.default)(dir, api.functionNamespace, envConfig);
  }).map(publish).map(setAlias).map(setPermissions).tap(function () {
    console.log("All functions deployed");
  }).then(function () {
    return createDeployment({ restApiId: api.id, stageName: envName, variables: { functionAlias: envName } }).tap(function () {
      console.log("Deployed complete!");
    });
  });

  function setAlias(func) {
    var params = {
      FunctionName: func.FunctionName,
      Name: envName
    };

    return getAlias(params).then(function () {
      params.FunctionVersion = func.Version;
      return updateAlias(params);
    }).catch(function (err) {
      if (err.code === 'ResourceNotFoundException') {
        params.FunctionVersion = func.Version;
        return createAlias(params);
      } else {
        return _bluebird2.default.reject(err);
      }
    });
  }

  function setPermissions(func) {
    var _func$AliasArn$match = func.AliasArn.match(new RegExp('^arn:aws:lambda:' + api.region + ':([0-9]+):function:([a-zA-Z0-9-_]+):'));

    var _func$AliasArn$match2 = _slicedToArray(_func$AliasArn$match, 3);

    var accountId = _func$AliasArn$match2[1];
    var functionName = _func$AliasArn$match2[2];

    var attrs = {
      Action: 'lambda:InvokeFunction',
      Qualifier: envName,
      FunctionName: functionName,
      Principal: 'apigateway.amazonaws.com',
      StatementId: 'api-gateway-access',
      SourceArn: 'arn:aws:execute-api:' + api.region + ':' + accountId + ':' + api.id + '/*'
    };

    return addLambdaPermission(attrs).catch(function (err) {
      if (err.code !== 'ResourceConflictException') {
        throw err;
      }
    });
  }

  function publish(func) {
    return publishVersion({ FunctionName: func.FunctionName });
  }

  function createDeployment(params) {
    return new _bluebird2.default(function (resolve, reject) {
      apiGateway.createDeployment(params, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  function publishVersion(params) {
    return new _bluebird2.default(function (resolve, reject) {
      lambda.publishVersion(params, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  function addLambdaPermission(params) {
    return new _bluebird2.default(function (resolve, reject) {
      lambda.addPermission(params, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  function getAlias(params) {
    return new _bluebird2.default(function (resolve, reject) {
      lambda.getAlias(params, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  function createAlias(params) {
    return new _bluebird2.default(function (resolve, reject) {
      lambda.createAlias(params, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  function updateAlias(params) {
    return new _bluebird2.default(function (resolve, reject) {
      lambda.updateAlias(params, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
};

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _glob = require('../util/glob');

var _glob2 = _interopRequireDefault(_glob);

var _upload = require('./upload');

var _upload2 = _interopRequireDefault(_upload);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _prompt = require('../util/prompt');

var _prompt2 = _interopRequireDefault(_prompt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }