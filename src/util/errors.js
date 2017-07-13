export class EnvironmentVariableConflict extends Error {
  constructor ({ conflictVars, env }) {
    const message = `${conflictVars.join(', ')} have conflicting values. Fix this by using 'shep config set ${env}'`
    super(message)
    this.message = message
    this.name = 'EnvironmentVariableConflict'
  }
}

export class DuplicateEndpointError extends Error {
  constructor (method, path) {
    const msg = `Method '${method}' on path '${path}' already exists`
    super(msg)
    this.message = msg
    this.name = 'DuplicateEndpoint'
  }
}

export class EnvironmentsOutOfSync extends Error {
  constructor () {
    super()
    this.message = 'Environments are out of sync, run `shep config sync` to fix'
    this.name = 'EnvironmentsOutOfSync'
  }
}

export class AWSEnvironmentVariableNotFound extends Error {
  constructor (functionName, envVar) {
    const msg = `Variable${envVar ? ' ' + envVar : 's'} not found for ${functionName}`
    super(msg)
    this.message = msg
    this.name = 'AWSEnvironmentVariableNotFound'
  }
}
