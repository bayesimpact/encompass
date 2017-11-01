import { chain, keyBy } from 'lodash'
import { Provider, RepresentativePoint } from '../constants/datatypes'

export function population(
  serviceAreas: string[],
  representativePoints: RepresentativePoint[]
) {
  let serviceAreasHash = keyBy(serviceAreas)
  return chain(representativePoints)
    .filter(_ => _.service_area_id in serviceAreasHash)
    .sumBy(_ => _.population)
    .value()
}

/**
 * TODO (blocked on https://github.com/bayesimpact/time-distance-standards/issues/30)
 */
export function providers(
  serviceAreas: string[],
  providers: Provider[]
) {
  return 42
}
