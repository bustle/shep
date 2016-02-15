'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var name = _ref.name;

  var obj = {
    name: name,
    version: '1.0.0',
    main: 'index.js',
    scripts: {
      'test': 'echo \"Error: no test specified\" && exit 1'
    },
    dependencies: {}
  };

  return JSON.stringify(obj, null, 2);
};