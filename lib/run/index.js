'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var funcNames = _glob2.default.sync('functions/*/').map(function (dir) {
    return dir.split('/').slice(-2, -1)[0];
  });

  return (0, _prompt2.default)([{
    name: 'funcName',
    type: 'list',
    choices: funcNames,
    message: 'Which lambda function?'
  }]).then(function (params) {
    return run(params);
  });

  function run(_ref) {
    var funcName = _ref.funcName;

    var func = require(_path2.default.join(process.cwd(), 'functions/' + funcName));
    var event = require(_path2.default.join(process.cwd(), 'functions/' + funcName, 'event.json'));
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
  }
};

var _prompt = require('../util/prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('babel-register');