import { setup, clean, exists } from './helpers'

describe('shepherd new', ()=>{
  
  before(setup)
  after(clean)

  it('creates a new directory', () => exists('test-api') )
  it('creates a folder for functions', () => exists('test-api/functions') )

})
