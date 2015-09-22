var mockery = require('mockery');
var sinon = require('sinon');
var chai = require('chai');
var P = require('bluebird');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

describe('shepherd deploy', function() {
  var restapis, jsonFile, pull;

  before(function() {
    mockery.enable({
     warnOnReplace: false,
     warnOnUnregistered: false,
     useCleanCache: true
    });

    restapis = {
      create: sinon.stub().returns(P.resolve({id: 'testID'}))
    };

    pull = sinon.stub().returns(P.resolve([]));

    jsonFile = {
      write: sinon.stub().returns(P.resolve()),
      read: sinon.stub().returns(P.resolve({
        name: 'test-name',
        description: 'a test description'
      }))
    };


    mockery.registerMock('./api-gateway/restapis', restapis);
    mockery.registerMock('./json-file', jsonFile);
    mockery.registerMock('./pull', pull);

    var deploy = require('../lib/deploy');
    return deploy();
  });

  after(function() {
    mockery.disable();
  });

  it('should create the new API', function () {
    expect(restapis.create).to.have.been.calledWithMatch('');
  });

  it('should write the id to the config file', function () {
    expect(jsonFile.write).to.have.been.calledWithMatch(/config/, { id: 'testID' });
  });

  it('should pull from AWSk', function () {
    expect(pull).to.have.been.calledWith('testID');
  });


});
