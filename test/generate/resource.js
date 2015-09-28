var chai = require('chai');
var mockery = require('mockery');
var sinon = require('sinon');
var P = require('bluebird');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

describe('shepherd generate', function() {
  describe('resource <path>', function() {
    var jsonFile;

    before(function() {
      mockery.enable({
       warnOnReplace: false,
       warnOnUnregistered: false,
       useCleanCache: true
      });

      jsonFile = {
        write: sinon.stub().returns(P.resolve())
      };

      mockery.registerMock('../../util/json-file', jsonFile);

      var generateResource = require('../../lib/generate/resource');
      return generateResource({_:['generate', 'resource', '/posts/{id}/author']});
    });

    it('should create the root path', function () {
      expect(jsonFile.write).to.have.been.calledWithMatch(/root/);
    });

    it('should create the sub paths', function () {
      expect(jsonFile.write).to.have.been.calledWithMatch(/posts/);
      expect(jsonFile.write).to.have.been.calledWithMatch(/posts-id/);
      expect(jsonFile.write).to.have.been.calledWithMatch(/posts-id-author/);
    });
  });
});
