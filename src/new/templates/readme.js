export default function({apiName, folder}){
  return `#${apiName || folder}`
}
