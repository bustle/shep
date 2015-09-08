var config = require('../config');
var https = require('https');
var aws4  = require('aws4');
var _ = require('lodash');

var baseOpts = { service: 'apigateway', region: config.AWS_REGION };

function request(opts, callback){
  aws4.sign(opts, { accessKeyId: config.AWS_ACCESS_KEY, secretAccessKey: config.AWS_SECRET_KEY });
  return https.request(opts, function(response) {
      var body = '';
      response.on('data', function(d) { body += d; });
      response.on('end', function() {
        var parsed = JSON.parse(body);
        callback(parsed);
      });
    }).end();
}

module.exports.restApis = function(callback){
  var opts = _.merge(baseOpts, { method: 'GET', path: '/restapis'});
  return request(opts, callback);
};
