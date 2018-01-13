import { chain, keyBy } from 'lodash'
import { Adequacies, Adequacy, AdequacyMode, RepresentativePoint } from '../constants/datatypes'
import { Store } from '../services/store'
import { totalPopulation } from './analytics'

export function adequaciesFromServiceArea(
  serviceAreas: string[],
  store: Store
): Lazy<Adequacy[]> {
  return chain(store.get('representativePoints'))
    .filter(_ => serviceAreas.includes(_.serviceAreaId))
    .map(_ => store.get('adequacies')[_.id])
    .filter(Boolean)
}

export function representativePointsFromServiceAreas(
  serviceAreas: string[],
  store: Store
): Lazy<RepresentativePoint[]> {
  let hash = keyBy(serviceAreas)
  return chain(store.get('representativePoints'))
    .filter(_ => _.serviceAreaId in hash)
}

export function summaryStatistics(
  serviceAreas: string[],
  store: Store
) {
  let adequacies = store.get('adequacies')
  let rps = representativePointsFromServiceAreas(serviceAreas, store)
  let adequateRps = rps.filter(_ =>
    adequacies[_.id] && (
      adequacies[_.id].adequacyMode === AdequacyMode.ADEQUATE_15
      || adequacies[_.id].adequacyMode === AdequacyMode.ADEQUATE_30
      || adequacies[_.id].adequacyMode === AdequacyMode.ADEQUATE_60
    )
  )

  let populationByAdequacy = [
    countByAdequacy(adequacies, rps, AdequacyMode.ADEQUATE_15),
    countByAdequacy(adequacies, rps, AdequacyMode.ADEQUATE_30),
    countByAdequacy(adequacies, rps, AdequacyMode.ADEQUATE_60),
    countByAdequacy(adequacies, rps, AdequacyMode.INADEQUATE)
  ]

  let population = totalPopulation(rps)
  let numAdequatePopulation = totalPopulation(adequateRps)
  let numInadequatePopulation = population - numAdequatePopulation

  let percentAdequatePopulation = 100 * numAdequatePopulation / population
  let percentInadequatePopulation = 100 - percentAdequatePopulation

  let numRps = rps.size().value()
  let numAdequateRps = adequateRps.size().value()
  let numInadequateRps = numRps - numAdequateRps

  return {
    numAdequatePopulation,
    numInadequatePopulation,
    percentAdequatePopulation,
    percentInadequatePopulation,
    numAdequateRps,
    numInadequateRps,
    populationByAdequacy
  }
}

/**
 * Converts 9-digit ZIP Codes to 5-digit codes.
 */
export function normalizeZip(zipCode: string) {
  return zipCode.split('-')[0]
}

function countByAdequacy(adequacies: Adequacies, rps: Lazy<RepresentativePoint[]> , adequacyMode: AdequacyMode){
  return totalPopulation(
      rps.filter(_ => adequacies[_.id] && (adequacies[_.id].adequacyMode === adequacyMode)
    )
  )
}
