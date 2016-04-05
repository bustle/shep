module.exports = [
  {
    name: 'name',
    type: 'list',
    choices: funcs,
    message: 'Which lambda function?',
    when: () => !flags.name
  }
]
