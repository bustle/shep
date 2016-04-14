module.exports = function({env}){
  let obj = {}

  obj.env = env
  obj.secretkey = `${env}-secret-key`

  return JSON.stringify(obj, null, 2)
}
