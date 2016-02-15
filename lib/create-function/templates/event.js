'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var obj = {
    key1: 'value',
    key2: 'value'
  };

  return JSON.stringify(obj, null, 2);
};