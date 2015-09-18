// var remove = require('remove');
// var exec = require('child_process').exec;
// var mockery = require('mockery');
// var sinon = require('sinon');
//
// describe('shepherd deploy', function() {
//   before(function(done) {
//     exec('shepherd new test-project', function(){
//       process.chdir('./test-project');
//       mockery.enable();
//       var restapis = {list: sinon.stub()};
//       restapis.yields(null, {statusCode: 200}, {login: "bulkan"});
//       mockery.registerMock('./api-gateway/restapis', restapis);
//       done();
//     });
//   });
//
//   after(function(done) {
//     mockery.disable();
//     process.chdir('../');
//     remove('./test-project', done);
//   });
//
//   it('should create the new API', function (done) {
//     exec('shepherd deploy', function(){
//       var config = require(path.resolve('./config'));
//       expect(config.id).to.eq('testID');
//     });
//   });
//
//   // it('should write the default resource', function (done) {
//   // });
//   //
//   // it('should write the default models', function (done) {
//   // });
//
//
// });
