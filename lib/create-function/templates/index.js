"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return "import env from './env'\n\nexport function handler({ headers, pathParameters, queryParameters, body }, context) {\n  // Replace below with your own code!\n  console.log({ headers, pathParameters, queryParameters, body, env })\n  context.succeed({ headers, pathParameters, queryParameters, body, env })\n}";
};