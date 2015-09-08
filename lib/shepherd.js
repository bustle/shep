#! /usr/bin/env node

var program = require('commander');
var fs = require('fs');

// try {
//   var configFile = fs.statSync('./shepherd-config.js')
// } catch (e) {
//   console.log(chalk.red('No shepherd-config.js file present. Did you mean to run this command from the project root?'))
//   process.exit(1)
// }

program
  .command('new <folder_name>')
  .description('Generate a new project folder')
  .action(createNewProject);

program
  .command('generate', 'Generate a new API endpoint, Lambda function, and test');

program
  .command('test [api_name]')
  .description('Run tests. Optionally name a specific test to run')
  .action(wip);

program
  .command('deploy', 'Deploy both new and updated functions/apis.');

program
  .command('server')
  .description('Start a local development server for APIs')
  .action(wip);

program.parse(process.argv);

function createNewProject(folderName){
  fs.mkdir(folderName, function(err){
    if (err) { throw(err); }
    fs.mkdir(folderName + '/apis');
    fs.mkdir(folderName + '/functions');
    fs.createReadStream(__dirname + '/../templates/shepherd-config.js.template').pipe(fs.createWriteStream(folderName + '/shepherd-config.js'));
  });
}

function wip(){
  console.error('That command does not work yet');
}
