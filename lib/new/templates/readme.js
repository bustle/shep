"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var apiName = _ref.apiName;
  var folder = _ref.folder;

  return "#" + (apiName || folder);
};