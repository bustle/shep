'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (config) {
  var apiGateway = new _awsSdk2.default.APIGateway();

  return (0, _prompt2.default)([{
    name: 'path',
    message: 'Path?',
    default: '/users'
  }]).then(create).then(_pull2.default);

  function create(params) {
    var lastSlashIndex = params.path.lastIndexOf('/');
    var parentPath = params.path.substring(0, lastSlashIndex);
    var pathPart = params.path.substring(lastSlashIndex + 1);
    if (parentPath === '') {
      parentPath = '/';
    }
    var parentResource = config.resources.find(function (resource) {
      return resource.path === parentPath;
    });

    if (parentResource) {
      console.log('Creating Resource on AWS...');
      return createResource(config.id, parentResource.id, pathPart);
    } else {
      return _bluebird2.default.reject('The parent resource \'' + parentPath + '\' does not exist. Create it first');
    }
  }

  function createResource(restApiId, parentId, pathPart) {
    return new _bluebird2.default(function (resolve, reject) {
      apiGateway.createResource({ restApiId: restApiId, parentId: parentId, pathPart: pathPart }, function (err, res) {
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

var _prompt = require('../util/prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _pull = require('../pull');

var _pull2 = _interopRequireDefault(_pull);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }