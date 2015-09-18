const path = require('path');
const config = require(path.resolve('./environment'));
const https = require('https');
const aws4  = require('aws4');
const P = require('bluebird');
const _ = require('lodash');

module.exports = function(opts){
  return new P(function(resolve, reject){
    if (!config || !config.key || !config.secret || !config.region ){
      reject(new Error('Config not complete. Run "shepherd configure"'));
    } else {
      var mergedOpts = _.assign({ service: 'apigateway', region: config.region }, opts);
      aws4.sign(mergedOpts, { accessKeyId: config.key, secretAccessKey: config.secret });
      var req = https.request(mergedOpts, function(response) {
        var body = '';
        response.on('data', function(d) { body += d; });
        response.on('end', function() {
          resolve(JSON.parse(body));
        });
      });

      req.on('error', reject);
      req.end(opts.body || '');
    }
  });
};
