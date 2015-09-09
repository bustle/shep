var remove = require('remove');
var exec = require('child_process').exec;
var fs = require('fs');
var expect = require('chai').expect;

describe('shepherd deploy', function() {
  before(function(done) {
    exec('shepherd new test-project', function(){
      process.chdir('./test-project');
      done();
    });
  });

  after(function(done) {
    process.chdir('../');
    remove('./test-project', done);
  });

  describe('*', function(){
    before(function(done){
      process.chdir('./apis');
      done();
    });

    after(function(done) {
      process.chdir('../');
      done();
    });

    it('should error from not being run in project root', function (done) {
      exec('shepherd deploy', function(err, stdout){
        expect(err.code).to.eq(1);
        expect(stdout).to.match(/project root/);
        done();
      });
    });
  });
});
