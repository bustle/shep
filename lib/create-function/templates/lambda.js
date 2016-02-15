'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var role = _ref.role;

  var obj = {
    Handler: 'index.handler',
    MemorySize: 128,
    Role: role,
    Timeout: 3
  };

  return JSON.stringify(obj, null, 2);
};