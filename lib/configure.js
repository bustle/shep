const prompt = require('prompt');

module.exports = function(){
  prompt.start();


  prompt.get(['AWS Key', 'AWS Secret Token', 'AWS Region'], function (err, result) {
    console.log(result);
  });
};
