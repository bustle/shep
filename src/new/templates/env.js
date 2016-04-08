module.exports = function({env}){
  return `env=${env}
secret=${env}-key
`
}
