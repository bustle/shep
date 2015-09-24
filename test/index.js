/* jshint expr:true */

var mockery = require('mockery');
var sinon = require('sinon');
var chai = require('chai');
var P = require('bluebird');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

describe('shepherd', function() {
  var help;

  before(function() {
    mockery.enable({
     warnOnReplace: false,
     warnOnUnregistered: false,
     useCleanCache: true
    });

    help = sinon.stub().returns(P.resolve());

    mockery.registerMock('./help', help);
  });

  after(function() {
    mockery.disable();
  });

  it('should load and call the sub command', function () {
    var args = { _: ['help'] };
    return require('../lib/index')(args).then(function(){
      expect(help).to.have.been.called;
    });
  });

});
