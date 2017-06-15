/* eslint import/namespace: ['error', { allowComputed: true }] */
import Promise from 'bluebird'
import * as rules from './rules'

export default async function (opts) {
  const ruleNames = Object.keys(rules).filter((name) => name !== 'toString' && name !== 'default')
  const warnings = await Promise.map(ruleNames, (name) => rules[name](opts))
  const flatWarnings = warnings.reduce((com, a) => com.concat(a), [])
  const errors = warnings.filter(({ type }) => type === 'error').map(({ message }) => message)

  return { warnings: flatWarnings, errors }
}
