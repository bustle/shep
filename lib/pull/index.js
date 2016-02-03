'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return _fsExtraPromise2.default.readJsonAsync('api.json').then(function (api) {
    if (api.id) {
      return getResources(api.id).get('items').then(function (resources) {
        return [api, resources];
      });
    } else {
      return _bluebird2.default.reject(new Error('No `id` found in api.json file'));
    }
  }).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var api = _ref2[0];
    var resources = _ref2[1];

    return _fsExtraPromise2.default.writeJsonAsync('api.json', (0, _lodash.assign)(api, { resources: resources }), { spaces: 2 });
  });

  function getResources(id) {
    return new _bluebird2.default(function (resolve, reject) {
      var params = { restApiId: id, embed: 'methods' };
      apigateway.getResources(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
};

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fsExtraPromise = require('fs-extra-promise');

var _fsExtraPromise2 = _interopRequireDefault(_fsExtraPromise);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apigateway = new _awsSdk2.default.APIGateway();