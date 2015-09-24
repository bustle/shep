const jsonFile = require('./json-file');
const _ = require('lodash');

// Note this follows the official AWS-SDK node library:
// http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html
const configVars = ['accessKeyId', 'secretAccessKey', 'region'];

module.exports = function(args){
  return jsonFile.write('environment.json', _.pick(args, configVars));
};
