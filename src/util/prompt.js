const inquirer = require('inquirer')
const Promise = require('bluebird')

module.exports = function(questions) {
  return new Promise(function(resolve) {
    inquirer.prompt(questions,resolve)
  })
}
