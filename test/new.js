import { setup, clean, exists } from './helpers'

describe('shepherd new --no-api', ()=>{

  before(setup)
  after(clean)

  it('creates a new directory', () => exists('test-api') )
  it('creates a folder for functions', () => exists('test-api/functions') )
  it('creates an env file', () => exists('test-api/env.js') )
  it('creates a package file', () => exists('test-api/package.json') )
  it('creates a readme', () => exists('test-api/README.md') )


})
