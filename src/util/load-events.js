import globby from 'globby'

export default function(name, inputs){
  const patterns = inputs && inputs.length !== 0 ? inputs : ['*']
  const events = globby.sync(patterns, { cwd: `functions/${name}/events` })
  if (events.length === 0) {
    throw new Error(`No events in 'functions/${name}/events' found matching patterns: ${JSON.stringify(inputs)}`)
  } else {
    return events
  }
}
