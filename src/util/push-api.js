import { pushApi } from './aws/api-gateway'
import { update } from './pkg-config'

export default function (api, apiId, region) {
  return pushApi(api, apiId)
  .tap((id) => update({ apiId: id, region }))
}
