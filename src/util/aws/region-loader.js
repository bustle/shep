import AWS from './'
import { pkg } from '../load'

export default async function () {
  if (!AWS.config.region) {
    const { shep } = await pkg()
    AWS.config.update({ region: shep.region })
  }
}
