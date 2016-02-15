'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var name = _ref.name;

  var func = require(_path2.default.join(process.cwd(), 'functions/' + name));
  var event = require(_path2.default.join(process.cwd(), 'functions/' + name, 'event.json'));
  var context = {
    succeed: function succeed(res) {
      console.log('Success:');
      console.log(JSON.stringify(res, null, 2));
      process.exit(0);
    },
    fail: function fail(res) {
      console.log('Failure:');
      console.log(JSON.stringify(res, null, 2));
      process.exit(1);
    }
  };
  func.handler(event, context);
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('babel-register');