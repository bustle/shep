import { writeFile } from '../util/modules/fs'
import { webpack } from '../new/templates'

export default function run (opts) {
  const output = opts.output

  return writeFile(output, webpack())
}
