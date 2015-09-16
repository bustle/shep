const path = require('path');
const config = require(path.resolve('./environment'));
const https = require('https');
const aws4  = require('aws4');
const P = require('bluebird');

module.exports = function(opts){
  return new P(function(resolve, reject){
    aws4.sign(opts, { accessKeyId: config.key, secretAccessKey: config.secret });
    var req = https.request(opts, function(response) {
      var body = '';
      response.on('data', function(d) { body += d; });
      response.on('end', function() {
        resolve(JSON.parse(body));
      });
    });

    req.on('error', reject);
    req.end(opts.body || '');
  });
};
