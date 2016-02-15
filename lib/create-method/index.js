'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts, config) {

  var baseParams = {
    restApiId: config.apiId,
    resourceId: opts.resourceId,
    httpMethod: opts.httpMethod
  };

  return (0, _apiGateway3.putMethod)(assign({ authorizationType: 'None' }, baseParams)).then(function (params) {
    var attrs = {
      restApiId: config.apiId,
      resourceId: params.resourceId,
      httpMethod: params.httpMethod,
      type: 'AWS',
      integrationHttpMethod: 'POST',
      uri: 'arn:aws:apigateway:' + config.region + ':lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:' + config.accountId + ':function:' + (config.functionNamespace + opts.funcName) + ':${stageVariables.functionAlias}/invocations',
      requestTemplates: {}
    };

    attrs.requestTemplates[params.contentType] = _apiGateway2.default;

    return (0, _apiGateway3.putIntegration)(attrs);
  }).then(function (params) {
    var attrs = {
      restApiId: api.id,
      resourceId: params.resourceId,
      httpMethod: params.httpMethod,
      statusCode: params.statusCode,
      responseTemplates: {}
    };

    attrs.responseTemplates[params.contentType] = null;

    return (0, _apiGateway3.putIntegrationResponse)(attrs);
  }).then(function (params) {
    var attrs = {
      restApiId: api.id,
      resourceId: params.resourceId,
      httpMethod: params.httpMethod,
      statusCode: params.statusCode
    };

    return (0, _apiGateway3.putMethodResponse)(attrs);
  });
};

var _apiGateway = require('../templates/api-gateway');

var _apiGateway2 = _interopRequireDefault(_apiGateway);

var _apiGateway3 = require('../util/api-gateway');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }