var chai = require('chai');
var mockery = require('mockery');
var sinon = require('sinon');
var P = require('bluebird');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

describe('shepherd generate', function() {
  describe('resource <name>', function() {
    var create;

    before(function() {
      mockery.enable({
       warnOnReplace: false,
       warnOnUnregistered: false,
       useCleanCache: true
      });

      create = {
       file: sinon.stub().returns(P.resolve()),
       dir: sinon.stub().returns(P.resolve())
      };

      mockery.registerMock('../create', create);

      var generateResource = require('../lib/generate/resource');
      return generateResource('test-resource');
    });

    it('should create the named folder', function () {
      expect(create.dir).to.have.been.calledWithMatch(/test-resource/);
    });
  });

  describe('function <name>', function(){
    var create;

    before(function() {
      mockery.enable({
       warnOnReplace: false,
       warnOnUnregistered: false,
       useCleanCache: true
      });

      create = {
       file: sinon.stub().returns(P.resolve()),
       dir: sinon.stub().returns(P.resolve())
      };

      mockery.registerMock('../create', create);

      var generateFunction = require('../lib/generate/function');
      return generateFunction('test-func');
    });

    it('should create the named folder', function () {
      expect(create.dir).to.have.been.calledWithMatch(/test-func/);
    });

    it('should create index.js', function () {
      expect(create.file).to.have.been.calledWithMatch(/test-func\/index.js/);
    });

    it('should create package.json', function () {
      expect(create.file).to.have.been.calledWithMatch(/test-func\/package.json/);
    });
  });
});
