var remove = require('remove');
var exec = require('child_process').exec;
var fs = require('fs');
var os = require('os');
var expect = require('chai').expect;
var path = require('path');

describe('shepherd new', function() {
  before(function(done) {
    process.chdir(os.tmpdir());
    exec('shepherd new test-project', done);
  });

  after(function(done) {
    remove('./test-project', done);
  });

  it('should create the project folder', function (done) {
    fs.stat('./test-project', function(err, stat){
      if (err) { done(err); }
      if (stat.isDirectory()){ done(); }
    });
  });

  it('should create the functions folder', function (done) {
    fs.stat('./test-project/functions', function(err, stat){
      if (err) { done(err); }
      if (stat.isDirectory()){ done(); }
    });
  });

  it('should create the resources folder', function (done) {
    fs.stat('./test-project/resources', function(err, stat){
      if (err) { done(err); }
      if (stat.isDirectory()){ done(); }
    });
  });

  it('should create the models folder', function (done) {
    fs.stat('./test-project/models', function(err, stat){
      if (err) { done(err); }
      if (stat.isDirectory()){ done(); }
    });
  });

  it('should create the stages folder', function (done) {
    fs.stat('./test-project/stages', function(err, stat){
      if (err) { done(err); }
      if (stat.isDirectory()){ done(); }
    });
  });

  it('should create the config file', function (done) {
    fs.stat('./test-project/config.js', function(err, stat){
      if (err) { done(err); }
      expect(stat.isFile()).to.eq(true);
      var config = require(path.resolve('./test-project/config'));
      expect(config.name).to.eq('test-project');
      done();
    });
  });

  it('should create the environment file', function (done) {
    fs.stat('./test-project/environment.js', function(err, stat){
      if (err) { done(err); }
      expect(stat.isFile()).to.eq(true);
      done();
    });
  });
});
