var expect = require('chai').expect;
var path = require('path');
var exec = require('child_process').exec;
var os = require('os');
var remove = require('remove');

describe('shepherd configure', function() {
  before(function(done) {
    process.chdir(os.tmpdir());
    exec('shepherd new test-project', function(){
      process.chdir('./test-project');
      done();
    });
  });

  after(function(done) {
    process.chdir('../');
    remove('./test-project', done);
  });

  it('should write the AWS id to the config file', function (done) {
    exec('shepherd configure --key key --secret secret --region east', function(){
      var config = require(path.resolve('./environment'));
      expect(config.key).to.eq('key');
      expect(config.secret).to.eq('secret');
      expect(config.region).to.eq('east');
      done();
    });
  });

});
