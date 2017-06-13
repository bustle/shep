const { execSync } = require('child_process')
const { readdirSync, statSync } = require('fs')

console.log(`### \`shep\``)
console.log('```')
console.log(execSync(`./cli.js --help`).toString().replace(/cli\.js/, 'shep').trim())
console.log('```')

const commandDir = './src/commands'
const mainCommands = readdirSync(commandDir)
const subCommands = mainCommands
      .filter(isDir)
      .map(findSubCommands)
      .reduce(flatten)
const allCommands = mainCommands.concat(subCommands).map((c) => c.replace(/\.js/g, '')).sort()

allCommands.forEach((command) => {
  let help = execSync(`./cli.js ${command} --help`).toString().replace(/cli\.js/, 'shep').trim()
  console.log(`#### \`shep ${command}\``)
  console.log('```')
  console.log(help)
  console.log('```')
})

function isDir (path) {
  return statSync(`${commandDir}/${path}`).isDirectory()
}

function findSubCommands (path) {
  return readdirSync(`${commandDir}/${path}`)
  .map((c) => `${path} ${c}`)
}

function flatten (acc, arr) {
  return acc.concat(arr)
}
