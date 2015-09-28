/* jshint expr:true */

var chai = require('chai');
var fs = require('fs');
var jsonFile = require('../../lib/util/json-file');
var expect = chai.expect;

var tmpDir = require('os').tmpdir();

describe('jsonFile', function() {
  describe('.read', function(){
    var testFile = tmpDir + '/sheptest.json';
    var missingTestFile = tmpDir + '/missing.json';

    before(function(done) {
      fs.writeFile(testFile, '{"foo": "bar"}', done);
    });

    after(function(done) {
      fs.unlink(testFile, done);
    });

    it('should read an existing file', function () {
      return jsonFile.read(testFile).then(function(obj){
        expect(obj).to.eql({foo: 'bar'});
      });
    });

    it('should error with non existant file', function () {
      return jsonFile.read(missingTestFile).catch(function(err){
        expect(err).to.exist;
      });
    });

    it('should read an existing file with a default', function () {
      return jsonFile.read(missingTestFile, {default: {bar: 'baz'}}).then(function(obj){
        expect(obj).to.eql({bar: 'baz'});
      });
    });
  });

});
