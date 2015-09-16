
const create = require('./create');

module.exports = function (folderName){
  create.dir(folderName, function(err){
    if (err) { throw(err); }
    create.dir(folderName + '/resources');
    create.dir(folderName + '/stages');
    create.dir(folderName + '/models');
    create.dir(folderName + '/functions');
    create.file({
      path: folderName + '/config.js',
      content: 'module.exports = {}'
    });
  });
};
