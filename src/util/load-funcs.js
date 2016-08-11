import globby from 'globby'

export default function(inputs){
  const patterns = inputs && inputs.length !== 0 ? inputs : ['*']
  const funcs = globby.sync(patterns, { cwd: 'functions' })
  if (funcs.length === 0) {
    throw new Error(`No functions found matching patterns: ${JSON.stringify(funcs)}`)
  } else {
    return funcs
  }
}
