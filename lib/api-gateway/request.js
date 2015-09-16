const path = require('path');
const config = require(path.resolve('./config'));
const https = require('https');
const aws4  = require('aws4');

module.exports = function(opts, callback){
  aws4.sign(opts, { accessKeyId: config.AWS_ACCESS_KEY, secretAccessKey: config.AWS_SECRET_KEY });
  return https.request(opts, function(response) {
    var body = '';
    response.on('data', function(d) { body += d; });
    response.on('end', function() {
      if (callback){
        callback(JSON.parse(body));
      }
    });
  }).end(opts.body || '');
};
