const restapis = require('./api-gateway/restapis');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const _ = require('lodash');

module.exports = function(){
  const configPath = path.resolve('./config');
  const config = require(configPath);
  if (config.id){

  } else {
    restapis.create(config.name, config.description, function(response){
      console.log(chalk.green('✔'),'created new api:', response.name);
      config.id = response.id;
      fs.writeFile(configPath + '.js', 'module.exports = ' + JSON.stringify(config, null, 2) + ';');
      restapis.resources(response.id, function(resp){
        fs.writeFile(path.resolve( './resources/root.json'), JSON.stringify(filterKeys(resp._embedded.item), null, 2));
      });
      restapis.models(response.id, function(resp){
        resp._embedded.item.map(function(model){
          var item = filterKeys(model);
          fs.writeFile(path.resolve( './models/' + item.name + '.json'), JSON.stringify(filterKeys(item), null, 2));
        });
      });
    });
  }
};

function filterKeys(obj){
  return _.pick(obj, function(value, key) {
    return !_.startsWith(key, '_');
  });
}
