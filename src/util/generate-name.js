import { pkg } from './load'
import kebabCase from 'lodash.kebabCase'

export default function(str){
  return {
    shortName: kebabCase(str),
    fullName: kebabCase(`${pkg().name} ${str}`)
  }
}
