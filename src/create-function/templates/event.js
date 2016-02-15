export default function(){
  let obj = {
    key1: 'value',
    key2: 'value'
  }

  return JSON.stringify(obj, null, 2)
}
