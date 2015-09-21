const exec = require('child_process').exec;
const P = require('bluebird');

module.exports = P.promisify(exec);
