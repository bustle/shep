import execa from 'execa'

describe('CLI', () => {
  it('should execute without errors', () => {
    return execa('./cli.js', ['--help'])
  })
})
