export default function(){
  return `import env from './env'

export function handler({ headers, pathParameters, queryParameters, body }, context) {
  // Replace below with your own code!
  console.log({ headers, pathParameters, queryParameters, body, env })
  context.succeed({ headers, pathParameters, queryParameters, body, env })
}`
}
