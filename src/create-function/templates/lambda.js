module.exports = function({ role }){
  let obj = {
    Handler: 'index.handler',
    MemorySize: 128,
    Role: role,
    Timeout: 3
  }

  return JSON.stringify(obj, null, 2)
}
