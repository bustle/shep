const shep = require('./lib/index')
const { execSync } = require('child_process')


console.log(`### \`shep\``)
console.log('```')
console.log(execSync(`shep --help`).toString().trim())
console.log('```')

for (var cmd in shep) {
  let help = execSync(`shep ${cmd} --help`).toString().trim()
  console.log(`#### \`shep ${cmd}\``)
  console.log('```')
  console.log(help)
  console.log('```')
}
