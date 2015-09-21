module.exports = function (args){
  switch (args._[1]) {
    case 'resource':
      require('./generate/resource')(args._[2]);
      break;
    case 'function':
      require('./generate/function')(args._[2]);
      break;
    case 'model':
      break;
    case 'stage':
      break;
    default:
      console.log('default command');
  }
};
