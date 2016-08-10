import globby from 'globby'

export default function(func, eventName){

  const eventDir = `functions/${func}/events`
  let events = globby.sync('*', { cwd: eventDir })
  if (eventName){
    events = events.filter((event) => event === `${eventName}.json`)
    if (events.length === 0) {
      throw new Error(`No event in '${eventDir}' called ${eventName}`)
    }
  }

  return events
}
