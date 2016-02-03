var P = require('bluebird');
var readFile = P.promisify(require('fs').readFile);
var writeFile = P.promisify(require('fs').writeFile);
var _ = require('lodash');
var log = require('./log');

module.exports = {
  write: function(path, attrs){
    var action = 'updated';
    return readFile(path).
      catch(function(){
        action = 'created';
        return '{}';
      }).
      then(JSON.parse).
      then(function(obj){
        return _.merge(_.cloneDeep(obj), attrs);
      }).
      then(function(obj){
        return writeFile(path, JSON.stringify(obj, null, 2));
      }).tap(function(){
        log.success(action, 'file:', path);
      });
  },

  read: function(path, opts){
    return readFile(path).
      then(JSON.parse).
      catch(function(err){
        if (opts.default) {
          return P.resolve(opts.default);
        } else {
          throw err;
        }
      });
  }
};
