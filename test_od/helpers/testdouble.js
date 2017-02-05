import td from 'testdouble'
import Promise from 'bluebird'

td.config({ promiseConstructor: Promise })

export default td
