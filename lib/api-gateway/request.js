const jsonFile = require('../json-file');
const https = require('https');
const aws4  = require('aws4');
const P = require('bluebird');
const _ = require('lodash');

module.exports = function(opts){
  return jsonFile.read('environment.json').then(function(env){
    return new P(function(resolve, reject){
      if (!env || !env.key || !env.secret || !env.region ){
        reject(new Error('Config not complete. Run "shepherd config"'));
      } else {
        var mergedOpts = _.assign({ service: 'apigateway', region: env.region }, opts);
        aws4.sign(mergedOpts, { accessKeyId: env.key, secretAccessKey: env.secret });
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
  });
};
