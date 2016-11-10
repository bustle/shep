import { pkg } from './load'
import kebabCase from 'lodash.kebabcase'

export default function (str) {
  const expandedStr = /^\/\s/.test(str) ? str.replace('/', 'root') : str
  return {
    shortName: kebabCase(expandedStr),
    fullName: kebabCase(`${pkg().name} ${expandedStr}`)
  }
}
