const shep = require('./lib/index')
const { execSync } = require('child_process')


console.log(`### shep`)
console.log(execSync(`shep --help`).toString())

for (var cmd in shep) {
  let help = execSync(`shep ${cmd} --help`).toString()
  console.log(`#### shep ${cmd}`)
  console.log(help)
}
