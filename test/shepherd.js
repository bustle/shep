var assert = require("assert");
var remove = require('remove');
var exec = require('child_process').exec;
var fs = require('fs');


describe('shepherd new', function() {
  before(function(done) {
    exec('shepherd new test-project', done);
  });

  after(function(done) {
    remove('./test-project', done);
  })

  it('should create the project folder', function (done) {
    fs.stat('./test-project', function(err, stat){
      if (err) { done(err) }
      if (stat.isDirectory()){ done() }
    })
  })

  it('should create the functions folder', function (done) {
    fs.stat('./test-project/functions', function(err, stat){
      if (err) { done(err) }
      if (stat.isDirectory()){ done() }
    })
  })

  it('should create the apis folder', function (done) {
    fs.stat('./test-project/apis', function(err, stat){
      if (err) { done(err) }
      if (stat.isDirectory()){ done() }
    })
  })

  it('should create the shepherd-config file', function (done) {
    fs.stat('./test-project/shepherd-config.js', function(err, stat){
      if (err) { done(err) }
      if (stat.isFile()){ done() }
    })
  })
});


// describe('shepherd generate function <name>', function() {
//   before(function(done) {
//     exec('shepherd new test-project', done)
//   });
//
//   after(function(done) {
//     remove('test-project', done)
//   });
//
//   it('should create the function folder', function () {})
//   it('should create the index.json file', function () {})
//   it('should create the package.json file', function () {})
//   it('should create the config.json file', function () {})
// });
