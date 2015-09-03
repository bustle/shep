var assert = require("assert");
var remove = require('remove');
var exec = require('child_process').exec;
var fs = require('fs');

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

  describe('api <name>', function(){
    before(function(done){
      exec('shepherd generate api test-api', done);
    });

    it('should create the named folder', function (done) {
      fs.stat('./apis/test-api', function(err, stat){
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
