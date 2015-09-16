const restapis = require('./api-gateway/restapis');
const checkCwd = require('./check-cwd');

module.exports = function (){
  checkCwd();
  deployAPI();
};

function deployAPI(config){
  restapis.create(config.name, config.description, console.log);
}
