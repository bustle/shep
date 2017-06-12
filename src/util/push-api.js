import { pushApi } from './aws/api-gateway'
import { update } from './pkg-config'

export default async function (api, apiId, region) {
  const id = await pushApi(api, apiId)
  await update({ apiId: id, region })
  return id
}
