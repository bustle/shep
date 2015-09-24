/* jshint expr:true */

var mockery = require('mockery');
var sinon = require('sinon');
var chai = require('chai');
var P = require('bluebird');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

describe('shepherd generate', function() {
  var func;

  before(function() {
    mockery.enable({
     warnOnReplace: false,
     warnOnUnregistered: false,
     useCleanCache: true
    });

    func = sinon.stub().returns(P.resolve());

    mockery.registerMock('./function', func);
  });

  after(function() {
    mockery.disable();
  });

  it('should load and call the sub command', function () {
    var args = { _: ['generate','function'] };
    return require('../lib/generate')(args).then(function(){
      expect(func).to.have.been.called;
    });
  });

});
