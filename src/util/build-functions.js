import exec from './modules/exec'

export default function(PATTERN, NODE_ENV){
  return exec('webpack', [], { env: { PATTERN, NODE_ENV }})
}
