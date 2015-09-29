var chai = require('chai');
var mockery = require('mockery');
var sinon = require('sinon');
var P = require('bluebird');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

describe('shepherd new', function() {
  var create;
  var exec;

  before(function(){
   mockery.enable({
     warnOnReplace: false,
     warnOnUnregistered: false,
     useCleanCache: true
   });

   create = {
     file: sinon.stub().returns(P.resolve()),
     dir: sinon.stub().returns(P.resolve())
   };

   exec = sinon.stub().returns(P.resolve());

   mockery.registerMock('../util/create', create);
   mockery.registerMock('../util/exec', exec);

   var args = { _: ['new', 'Test API'] };
   var newProject = require('../lib/new');
   return newProject(args);
 });

 after(function(){
   mockery.disable();
 });

  it('should create the project folder', function () {
    expect(create.dir).to.have.been.calledWithMatch(/test-api/);
  });

  it('should create the resources folder', function () {
    expect(create.dir).to.have.been.calledWithMatch(/resources/);
  });

  it('should create the models folder', function () {
    expect(create.dir).to.have.been.calledWithMatch(/models/);
  });

  it('should create the stages folder', function () {
    expect(create.dir).to.have.been.calledWithMatch(/stages/);
  });

  it('should create the functions folder', function () {
    expect(create.dir).to.have.been.calledWithMatch(/functions/);
  });

  it('should create the config file', function () {
    expect(create.file).to.have.been.calledWithMatch(/config.js/);
  });

  it('should create the environment file', function () {
    expect(create.file).to.have.been.calledWithMatch(/environment.js/);
  });

  it('should create the environment file', function () {
    expect(create.file).to.have.been.calledWithMatch(/.gitignore/);
  });
  it('should create the README', function () {
    expect(create.file).to.have.been.calledWithMatch(/README/);
  });

  it('should create the initial git commit', function () {
    expect(exec).to.have.been.calledWithMatch(/git commit/);
  });
});
