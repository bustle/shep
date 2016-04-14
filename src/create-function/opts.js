module.exports = function(){
  return [
    {
      name: 'name',
      message: 'Function name?',
      validate: (input) => /^[a-zA-Z0-9-_]+$/.test(input) ? true : 'Function name must contain only letters, numbers, hyphens, or underscores'
    },
    {
      name: 'role',
      message: 'Lambda execution role. This must already exist. See your IAM console for details'
    }
  ]
}
