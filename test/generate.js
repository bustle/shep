import { setup, clean, exists } from './helpers'

describe('shepherd generate', ()=>{

  before((setup))
  after(clean)

  it('creates a function directory', () => exists('test-api/functions/') )

})
