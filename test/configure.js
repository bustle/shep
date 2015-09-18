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

  it('should write to the environment file', function (done) {
    exec('shepherd configure --key key --secret secret --region east', function(){
      var env = require(path.resolve('./environment'));
      expect(env.key).to.eq('key');
      expect(env.secret).to.eq('secret');
      expect(env.region).to.eq('east');
      done();
    });
  });

});
