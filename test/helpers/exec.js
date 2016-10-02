import td from 'testdouble'

const exec = td.replace('../../src/util/modules/exec')

function didExec(t, cmd, args, options = {}) {
  const secondArg = args? td.matchers.contains(args) : []
  td.verify(exec(td.matchers.contains(cmd), secondArg, td.matchers.contains(options)))
}

didExec.title = (providedTitle, cmd, subcmd) => `Executed ${cmd} ${subcmd || ''}`

export { exec, didExec }
