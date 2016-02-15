"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var apiName = _ref.apiName;
  var folder = _ref.folder;
  var region = _ref.region;
  var accountId = _ref.accountId;
  var functionNamespace = _ref.functionNamespace;
  var api = _ref.api;
  var apiId = _ref.apiId;

  var obj = {
    name: apiName || folder,
    version: "1.0.0",
    repository: "",
    description: "",
    license: "",
    babel: {
      presets: ["es2015"]
    },
    dependencies: {},
    devDependencies: {
      "babel-preset-es2015": "^6.5.0"
    },
    shepherd: { region: region, functionNamespace: functionNamespace, accountId: accountId, apiId: apiId }
  };

  if (api === false) {
    obj.shepherd.api = false;
  }

  return JSON.stringify(obj, null, 2);
};