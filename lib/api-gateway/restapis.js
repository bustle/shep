var config = require('../config');
var https = require('https');
var aws4  = require('aws4');
var _ = require('lodash');

var baseOpts = { service: 'apigateway', region: config.AWS_REGION };

module.exports.list = function(callback){
  var opts = _.merge(baseOpts, { method: 'GET', path: '/restapis'});
  return request(opts, callback);
};

module.exports.create = function(name, description, callback){
  var body = { name: name, description: description };
  var opts = _.merge(baseOpts, { method: 'POST', path: '/restapis', body: JSON.stringify(body)});
  return request(opts, callback);
};

function request(opts, callback){
  aws4.sign(opts, { accessKeyId: config.AWS_ACCESS_KEY, secretAccessKey: config.AWS_SECRET_KEY });
  return https.request(opts, function(response) {
    var body = '';
    response.on('data', function(d) { body += d; });
    response.on('end', function() {
      callback(JSON.parse(body));
    });
  }).end(opts.body || '');
}
