'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts, config) {
  var lastSlashIndex = opts.path.lastIndexOf('/');
  var parentPath = opts.path.substring(0, lastSlashIndex);
  var pathPart = opts.path.substring(lastSlashIndex + 1);
  if (parentPath === '') {
    parentPath = '/';
  }
  var parentResource = config.resources.find(function (resource) {
    return resource.path === parentPath;
  });

  if (parentResource) {
    return (0, _apiGateway.createResource)({ pathPart: pathPart, restApiId: config.apiId, parentId: parentResource.id }).then(function () {
      return (0, _pull2.default)(config);
    });
  } else {
    return _bluebird2.default.reject('The parent resource \'' + parentPath + '\' does not exist. Create it first');
  }
};

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _apiGateway = require('../util/api-gateway');

var _pull = require('../pull');

var _pull2 = _interopRequireDefault(_pull);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }