module.exports = function(){
  return [
    {
      name: 'apiId',
      message: 'The id of the AWS API you would like to get a json representation of',
      when: () => false // Never promp the user for this
    }
  ]
}
