function constructCommand (command, flags) {
  return Object.keys(flags)
  .map((flag) => {
    return `--${flag} ${flags[flag]}`
  })
  .reduce((str, flag) => {
    return `${str} ${flag}`
  }, command)
}

function allFlags (t, command, parser, flags) {
  const constructedCommand = constructCommand(command, flags)
  parser.parse(constructedCommand, (err, argv, output) => {
    err ? t.fail(`Error during yargs validation: ${err}`) : t.pass()
  })
}
allFlags.title = (providedTitle, command) => `No errors when all flags passed to ${command}`

function noFlags (t, command, parser, flags) {
  parser.parse(command, (err, argv, output) => {
    err ? t.fail(`Error during yargs validation: ${err}`) : t.pass()
  })
}
noFlags.title = (providedTitle, command) => `No errors when no flags passed to ${command}`

export { allFlags, noFlags }
