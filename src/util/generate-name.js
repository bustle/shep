import { pkg } from './load'
import kebabCase from 'lodash.kebabcase'

export default async function (str) {
  const expandedStr = /^\/\s/.test(str) ? str.replace('/', 'root') : str
  const { name } = await pkg()
  return {
    shortName: kebabCase(expandedStr),
    fullName: kebabCase(`${name} ${expandedStr}`)
  }
}
