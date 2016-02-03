import glob from 'glob'
import { promisify } from 'bluebird'

export default promisify(glob)
