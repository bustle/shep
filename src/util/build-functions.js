import exec from './modules/exec'

export default function (PATTERN, NODE_ENV) {
  return exec('webpack', ['--bail'], { env: { PATTERN, NODE_ENV } })
  .catch((e) => {
    if (e.code === 'ENOENT') {
      console.warn('No locally installed webpack found. Verify that webpack is installed')
    }

    throw e
  })
}
