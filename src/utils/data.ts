import { Store } from 'babydux'
import { chain, filter, keyBy } from 'lodash'
import { Adequacy } from '../constants/datatypes'
import { Actions } from '../services/store'

export function adequaciesFromServiceArea(serviceAreaId: string, store: Store<Actions>) {
  return chain(store.get('representativePoints'))
    .filter(_ => _.serviceAreaId === serviceAreaId)
    .map(_ => store.get('adequacies')[_.id])
    .filter(Boolean)
    .value()
}

export function representativePointsFromServiceAreas(serviceAreaIds: string[], store: Store<Actions>) {
  let hash = keyBy(serviceAreaIds)
  return filter(store.get('representativePoints'), _ => _.serviceAreaId in hash)
}
