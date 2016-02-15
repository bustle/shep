'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref, config) {
  var namespace = _ref.namespace;
  var env = _ref.env;
  var envName = _ref.envName;

  // THIS IS NOT YET WORKING
  var apiId = 1;

  var funcs = _glob2.default.sync('functions/*').map(function (path) {
    return path.split('/').pop();
  });

  _bluebird2.default.resolve(funcs).map(function (name) {
    return (0, _deployFunction2.default)({ name: name, namespace: namespace, env: env });
  }).map(publish).map(setAlias).map(setPermissions).then(createApiDeployment);

  function publish(func) {
    return (0, _lambda.publishVersion)({ FunctionName: func.FunctionName });
  }

  function setAlias(func) {
    var params = {
      FunctionName: func.FunctionName,
      Name: envName
    };

    return (0, _lambda.getAlias)(params).then(function () {
      params.FunctionVersion = func.Version;
      return (0, _lambda.updateAlias)(params);
    }).catch(function (err) {
      if (err.code === 'ResourceNotFoundException') {
        params.FunctionVersion = func.Version;
        return (0, _lambda.createAlias)(params);
      } else {
        return _bluebird2.default.reject(err);
      }
    });
  }

  function setPermissions(func) {
    if (config.api !== false) {
      var _func$AliasArn$match = func.AliasArn.match(new RegExp('^arn:aws:lambda:' + config.region + ':([0-9]+):function:([a-zA-Z0-9-_]+):'));

      var _func$AliasArn$match2 = _slicedToArray(_func$AliasArn$match, 3);

      var accountId = _func$AliasArn$match2[1];
      var functionName = _func$AliasArn$match2[2];

      var attrs = {
        Action: 'lambda:InvokeFunction',
        Qualifier: envName,
        FunctionName: functionName,
        Principal: 'apigateway.amazonaws.com',
        StatementId: 'api-gateway-access',
        SourceArn: 'arn:aws:execute-api:' + config.region + ':' + accountId + ':' + apiId + '/*'
      };

      return (0, _lambda.addPermission)(attrs).catch(function (err) {
        if (err.code !== 'ResourceConflictException') {
          throw err;
        }
      });
    }
  }

  function createApiDeployment() {
    if (config.api !== false) {
      return (0, _apiGateway.createDeployment)({ restApiId: apiId, stageName: envName, variables: { functionAlias: envName } });
    }
  }
};

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _glob = require('../util/glob');

var _glob2 = _interopRequireDefault(_glob);

var _deployFunction = require('../deploy-function');

var _deployFunction2 = _interopRequireDefault(_deployFunction);

var _lambda = require('../util/lambda');

var _apiGateway = require('../util/api-gateway');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }