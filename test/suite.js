import td from 'testdouble'
import clearRequire from 'clear-require'

beforeEach(()=> {
  clearRequire.all()
  td.reset()
})
