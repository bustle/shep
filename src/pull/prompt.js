import index from './index'
import { assign }  from 'lodash'

export default function(flags, config){
  return index(assign({},config, flags))
}
