import inquirer from 'inquirer'
import { Promise } from 'bluebird'

export default function(questions) {
  return new Promise(function(resolve) {
    inquirer.prompt(questions,resolve)
  })
}
