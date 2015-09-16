const restapis = require('./api-gateway/restapis');
const path = require('path');
const fs = require('fs');
// const _ = require('lodash');

module.exports = function(){
  const config = require(path.resolve('./config'));
  if (config.id){
    console.log('This API already has an ID on AWS. Not going to create another one');
  } else {


    restapis.create(config.name, config.description).
      then(function(resp){
        config.id = resp.id;
        fs.writeFile(path.resolve('./config') + '.js', 'module.exports = ' + JSON.stringify(config, null, 2) + ';');
      });
      // then(function(response){
      //   config.id = response.id;
      //   restapis.resources(response.id).
      //     then(function(resp){
      //       fs.writeFile(path.resolve( './resources/root.json'), JSON.stringify(filterKeys(resp._embedded.item), null, 2));
      //     });
      //   restapis.models(response.id)
      //     .then(function(resp){
      //       resp._embedded.item.map(function(model){
      //         var item = filterKeys(model);
      //         fs.writeFile(path.resolve( './models/' + item.name + '.json'), JSON.stringify(filterKeys(item), null, 2));
      //       });
      //     });
      // });

  }
};

// function filterKeys(obj){
//   return _.pick(obj, function(value, key) {
//     return !_.startsWith(key, '_');
//   });
// }
