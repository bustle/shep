var remove = require('remove');
var exec = require('child_process').exec;
var fs = require('fs');
var expect = require('chai').expect;

describe('shepherd generate', function() {
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
      process.chdir('./resources');
      done();
    });

    after(function(done) {
      process.chdir('../');
      done();
    });

    it('should error from not being run in project root', function (done) {
      exec('shepherd generate', function(err, stdout){
        expect(err.code).to.eq(1);
        expect(stdout).to.match(/project root/);
        done();
      });
    });
  });

  describe('resource <name>', function(){
    before(function(done){
      exec('shepherd generate resource test-resource', done);
    });

    it('should create the named folder', function (done) {
      fs.stat('./resources/test-resource', function(err, stat){
        if (err) { done(err); }
        if (stat.isDirectory()){ done(); }
      });
    });
  });

  describe('function <name>', function(){
    before(function(done){
      exec('shepherd generate function test-func', done);
    });

    it('should create the named folder', function (done) {
      fs.stat('./functions/test-func', function(err, stat){
        if (err) { done(err); }
        if (stat.isDirectory()){ done(); }
      });
    });

    it('should create index.js', function (done) {
      fs.stat('./functions/test-func/package.json', function(err, stat){
        if (err) { done(err); }
        if (stat.isFile()){ done(); }
      });
    });

    it('should create package.json', function (done) {
      fs.stat('./functions/test-func/index.js', function(err, stat){
        if (err) { done(err); }
        if (stat.isFile()){ done(); }
      });
    });
  });
});
