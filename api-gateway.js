var config = require('../config');

var https = require('https');
var aws4  = require('aws4');

opts = { service: 'apigateway', region: 'us-east-1', path: '/restapis', method: 'GET'}

var sig = aws4.sign(opts, { accessKeyId: config.AWS_ACCESS_KEY, secretAccessKey: config.AWS_SECRET_KEY })

function request(opts, callback){
  return https.request(opts, function(response) {
      var body = '';
      response.on('data', function(d) { body += d; });
      response.on('end', function() {
        var parsed = JSON.parse(body);
        callback(parsed);
      });
    }).end();
}

request(opts, function(res){
  console.log(JSON.stringify(res, null, 2));
})
