var chai = require('chai');
var mockery = require('mockery');
var sinon = require('sinon');
var P = require('bluebird');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

describe('shepherd generate', function() {
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

      mockery.registerMock('../../util/create', create);

      var generateFunction = require('../../lib/generate/function');
      return generateFunction({_: ['generate', 'function', 'test-func']});
    });

    it('should create the named folder', function () {
      expect(create.dir).to.have.been.calledWithMatch(/functions\/test-func/);
    });

    it('should create index.js', function () {
      expect(create.file).to.have.been.calledWithMatch(/functions\/test-func\/index.js/);
    });

    it('should create package.json', function () {
      expect(create.file).to.have.been.calledWithMatch(/test-func\/package.json/);
    });

    it('should create a .gitignore file', function () {
      expect(create.file).to.have.been.calledWithMatch(/functions\/test-func\/.gitignore/);
    });

    it('should create a awsConfig.json file', function () {
      expect(create.file).to.have.been.calledWithMatch(/functions\/test-func\/awsConfig.json/);
    });
  });
});
