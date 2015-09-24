var chai = require('chai');
var mockery = require('mockery');
var sinon = require('sinon');
var P = require('bluebird');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

describe('shepherd configure', function() {
  var jsonFile, credentials;

  before(function() {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    jsonFile = {
      write: sinon.stub().returns(P.resolve())
    };

    mockery.registerMock('./json-file', jsonFile);

    var configure = require('../lib/configure');
    credentials = {accessKeyId: 'key', secretAccessKey: 'secret', region: 'region'};
    return configure(credentials);
  });

  after(function() {
    mockery.disable();
  });

  it('should write to the environment file', function () {
    expect(jsonFile.write).to.have.been.calledWithMatch(/environment.json/, credentials);
  });

});
