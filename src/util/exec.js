import { promisify } from 'bluebird'
import { exec } from 'child_process'

export default promisify(exec)
