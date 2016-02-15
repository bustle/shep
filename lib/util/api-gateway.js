'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRestApi = createRestApi;
exports.createDeployment = createDeployment;
exports.getResources = getResources;
exports.createResource = createResource;
exports.putMethod = putMethod;
exports.putMethodResponse = putMethodResponse;
exports.putIntegration = putIntegration;
exports.putIntegrationResponse = putIntegrationResponse;

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiGateway = new _awsSdk2.default.APIGateway();

function createRestApi(params) {
  return new _bluebird2.default(function (resolve, reject) {
    apiGateway.createRestApi(params, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
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

function getResources(id) {
  return new _bluebird2.default(function (resolve, reject) {
    var params = { restApiId: id, embed: 'methods' };
    apiGateway.getResources(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function createResource(params) {
  return new _bluebird2.default(function (resolve, reject) {
    apiGateway.createResource(params, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

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