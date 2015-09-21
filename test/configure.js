var chai = require('chai');
var mockery = require('mockery');
var sinon = require('sinon');
var P = require('bluebird');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

describe('shepherd configure', function() {
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

    mockery.registerMock('./create', create);

    var configure = require('../lib/configure');
    return configure({key: 'test', secret: 'secret', region: 'east'});
  });

  after(function() {
    mockery.disable();
  });

  it('should write to the environment file', function () {
    expect(create.file).to.have.been.calledWithMatch(/environment.js/, sinon.match.object);
  });

});
