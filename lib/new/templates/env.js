"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return "module.exports = {\n  development: {\n    env: 'development',\n    secret: 'dev-key'\n  },\n  beta: {\n    env: 'beta',\n    secret: 'beta-key'\n  },\n  production: {\n    env: 'production',\n    secret: 'prod-key'\n  }\n}";
};