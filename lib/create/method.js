'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (api) {
  var funcNames = _glob2.default.sync('functions/*/').map(function (dir) {
    return dir.split('/').slice(-2, -1)[0];
  });
  var resourcePaths = api.resources.map(function (resource) {
    return resource.path;
  }).sort();
  var apiGateway = new _awsSdk2.default.APIGateway();

  return (0, _prompt2.default)([{
    name: 'resource',
    type: 'list',
    choices: resourcePaths,
    message: 'Which resource?'
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
    choices: funcNames,
    message: 'Which lambda function?'
  }]).then(function (params) {
    params.resourceId = api.resources.find(function (resource) {
      return resource.path === params.resource;
    }).id;
    return params;
  }).then(function (params) {

    var attrs = {
      restApiId: api.id,
      resourceId: params.resourceId,
      httpMethod: params.httpMethod,
      authorizationType: 'None'
    };

    return putMethod(attrs).return(params);
  }).then(function (params) {
    var attrs = {
      restApiId: api.id,
      resourceId: params.resourceId,
      httpMethod: params.httpMethod,
      type: 'AWS',
      integrationHttpMethod: 'POST',
      uri: 'arn:aws:apigateway:' + api.region + ':lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:' + api.accountId + ':function:' + (api.functionNamespace + params.funcName) + ':${stageVariables.functionAlias}/invocations',
      requestTemplates: {}
    };

    attrs.requestTemplates[params.contentType] = _apiGateway2.default;

    return putIntegration(attrs).return(params);
  }).then(function (params) {
    var attrs = {
      restApiId: api.id,
      resourceId: params.resourceId,
      httpMethod: params.httpMethod,
      statusCode: params.statusCode,
      responseTemplates: {}
    };

    attrs.responseTemplates[params.contentType] = null;

    return putIntegrationResponse(attrs).return(params);
  }).then(function (params) {
    var attrs = {
      restApiId: api.id,
      resourceId: params.resourceId,
      httpMethod: params.httpMethod,
      statusCode: params.statusCode
    };

    return putMethodResponse(attrs).return(params);
  });

  function putMethod(params) {
    return new _bluebird2.default(function (resolve, reject) {
      apiGateway.putMethod(params, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  function putMethodResponse(params) {
    return new _bluebird2.default(function (resolve, reject) {
      apiGateway.putMethodResponse(params, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  function putIntegration(params) {
    return new _bluebird2.default(function (resolve, reject) {
      apiGateway.putIntegration(params, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  function putIntegrationResponse(params) {
    return new _bluebird2.default(function (resolve, reject) {
      apiGateway.putIntegrationResponse(params, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
};

var _prompt = require('../util/prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _apiGateway = require('../templates/api-gateway');

var _apiGateway2 = _interopRequireDefault(_apiGateway);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }