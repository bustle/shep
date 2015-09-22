var mockery = require('mockery');
var sinon = require('sinon');
var chai = require('chai');
var P = require('bluebird');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

describe('shepherd pull', function() {
  var restapis, jsonFile;

  before(function() {
    mockery.enable({
     warnOnReplace: false,
     warnOnUnregistered: false,
     useCleanCache: true
    });

    restapis = {
      resources:  sinon.stub().returns(P.resolve({id: 'resource'})),
      models:  sinon.stub().returns(P.resolve([{name: 'model1'},{name: 'model2'}]))
    };

    jsonFile = {
      write: sinon.stub().returns(P.resolve())
    };


    mockery.registerMock('./api-gateway/restapis', restapis);
    mockery.registerMock('./json-file', jsonFile);

    var pull = require('../lib/pull');
    return pull('testID');
  });

  after(function() {
    mockery.disable();
  });

  it('should find resources', function () {
    expect(restapis.resources).to.have.been.calledWith('testID');
  });

  it('should find models', function () {
    expect(restapis.models).to.have.been.calledWith('testID');
  });


  it('should write the resource', function () {
    expect(jsonFile.write).to.have.been.calledWithMatch(/root.json/);
  });

  it('should write the models', function () {
    expect(jsonFile.write).to.have.been.calledWithMatch(/model1/);
    expect(jsonFile.write).to.have.been.calledWithMatch(/model2/);
  });

});
