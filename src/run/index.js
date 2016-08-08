import requireProject from '../util/require-project'
import loadLambdaConfig from '../util/load-lambda-config'
import build from '../build'

export default function(opts){
  const name = opts.name
  const env = opts.environemnt || 'development'

  const context = {}

  return build({ functions: name, env: env })
  .then(() => {
    const lambdaConfig = loadLambdaConfig(name)
    const [ fileName, handler ] = lambdaConfig.Handler.split('.')

    const requireStart = new Date()
    const entryFile = requireProject(`dist/${name}/${fileName}`)
    const requireEnd = new Date()
    const func = entryFile[handler]

    const timeoutMS = lambdaConfig.Timeout * 1000

    console.log('Load Time:', requireEnd - requireStart, 'ms')

    const callback = function(err, res){
      if (err) {
        console.log('Result: ERROR')
        console.log(err)
      } else {
        console.log('Result: SUCCESS')
        console.log(res)
      }
    }

    const event = requireProject(`functions/${name}/event.json`)

    return func(event, context, callback)
  })
}
