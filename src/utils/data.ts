import { chain, keyBy, round } from 'lodash'
import { Adequacy, RepresentativePoint } from '../constants/datatypes'
import { Store } from '../services/store'
import { totalPopulation } from './analytics'

export function adequaciesFromServiceArea(
  serviceArea: string,
  store: Store
): Lazy<Adequacy[]> {
  return chain(store.get('representativePoints'))
    .filter(_ => _.serviceAreaId === serviceArea)
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
    adequacies[_.id] && adequacies[_.id].isAdequate
  )

  let population = totalPopulation(rps)
  let numAdequatePopulation = totalPopulation(adequateRps)
  let numInadequatePopulation = population - numAdequatePopulation

  let percentAdequatePopulation = 100.0 * numAdequatePopulation / population
  let percentInadequatePopulation = 100.0 - percentAdequatePopulation

  let numRps = rps.size().value()
  let numAdequateRps = adequateRps.size().value()
  let numInadequateRps = numRps - numAdequateRps

  return {
    numAdequatePopulation,
    numInadequatePopulation,
    percentAdequatePopulation,
    percentInadequatePopulation,
    numAdequateRps,
    numInadequateRps
  }
}

/**
 * Converts 9-digit ZIP Codes to 5-digit codes.
 */
export function normalizeZip(zipCode: string) {
  return zipCode.split('-')[0]
}
