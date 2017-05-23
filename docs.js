const shep = require('./lib/index')
const { execSync } = require('child_process')

console.log(`### \`shep\``)
console.log('```')
console.log(execSync(`./cli.js --help`).toString().replace(/cli\.js/, 'shep').trim())
console.log('```')

for (var cmd in shep) {
  if (cmd !== 'version') {
    let help = execSync(`./cli.js ${camelCaseToSpace(cmd)} --help`).toString().replace(/cli\.js/, 'shep').trim()
    console.log(`#### \`shep ${camelCaseToSpace(cmd)}\``)
    console.log('```')
    console.log(help)
    console.log('```')
  }
}

function camelCaseToSpace (str) {
  return str.split('')
    .map(x => /[A-Z]/.test(x) ? ` ${x.toLowerCase()}` : x)
    .reduce((sum, cur) => sum + cur, '')
}
