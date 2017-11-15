import { Store } from 'babydux'
import { chain, keyBy } from 'lodash'
import { Adequacy, RepresentativePoint } from '../constants/datatypes'
import { Actions } from '../services/store'

export function adequaciesFromServiceArea(
  serviceAreaId: string,
  store: Store<Actions>
): Lazy<Adequacy[]> {
  return chain(store.get('representativePoints'))
    .filter(_ => _.serviceAreaId === serviceAreaId)
    .map(_ => store.get('adequacies')[_.id])
    .filter(Boolean)
}

export function representativePointsFromServiceAreas(
  serviceAreaIds: string[],
  store: Store<Actions>
): Lazy<RepresentativePoint[]> {
  let hash = keyBy(serviceAreaIds)
  return chain(store.get('representativePoints'))
    .filter(_ => _.serviceAreaId in hash)
}

/**
 * Converts 9-digit ZIP Codes to 5-digit codes.
 */
export function normalizeZip(zipCode: string) {
  return zipCode.split('-')[0]
}
