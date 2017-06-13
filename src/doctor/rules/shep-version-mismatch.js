import { version } from '../../index'
import * as load from '../../util/load'

export default async function () {
  const pkg = await load.pkg()
  const pkgVersion = pkg.devDependencies.shep
  return pkgVersion === version ? [] : generateWarning(version, pkgVersion)
}

function generateWarning (version, pkgVersion) {
  return [{
    rule: 'shep-version-mismatch',
    type: 'error',
    message: `shep ${version} is being used, but package.json requires ${pkgVersion}`
  }]
}
