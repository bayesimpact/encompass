import { chain, keyBy } from 'lodash'
import { CENSUS_MAPPING } from '../constants/census'
import { Adequacies, Adequacy, AdequacyMode, CensusGroup, PopulationByAdequacy, RepresentativePoint } from '../constants/datatypes'
import { Store } from '../services/store'
import { quickSumByCensus, totalPopulation } from './analytics'

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

export function summaryStatisticsTotal(
  rps: Lazy<RepresentativePoint[]>,
  store: Store
) {
  let adequacies = store.get('adequacies')
  return summaryStatisticsCounter(adequacies, rps)
}

function countByAdequacy(
  adequacies: Adequacies,
  rps: Lazy<RepresentativePoint[]>,
  adequacyMode: AdequacyMode,
  censusGroup?: CensusGroup) {
  let filteredRps = rps.filter(_ => adequacies[_.id] && (adequacies[_.id].adequacyMode === adequacyMode))
  if (censusGroup === undefined) {
    return totalPopulation(filteredRps)
  }
  return quickSumByCensus(censusGroup, filteredRps)
}

export interface StatisticsByGroup {
  [censusGroup: string]: PopulationByAdequacy
}
/**
* summaryStatisticsByCensus returns a mapping of
* census group to summaryStatitics for this group.
*/

export function summaryStatisticsByCensus(
  censusCategory: string,
  rps: Lazy<RepresentativePoint[]>,
  store: Store
) {
  let adequacies = store.get('adequacies')
  let censusCategoryGroups = CENSUS_MAPPING[censusCategory]
  let statisticsByGroup: StatisticsByGroup = {}
  censusCategoryGroups.forEach(censusGroup => {
    statisticsByGroup[censusGroup] = summaryStatisticsCounter(adequacies, rps, { censusCategory, censusGroup })
  })
  statisticsByGroup['Total'] = summaryStatisticsCounter(adequacies, rps)
  return statisticsByGroup
}

export function summaryStatisticsCounter(
  adequacies: Adequacies,
  representativePoints: Lazy<RepresentativePoint[]>,
  censusGroup?: CensusGroup
): PopulationByAdequacy {
  let populationByAdequacy = [
    countByAdequacy(adequacies, representativePoints, AdequacyMode.ADEQUATE_0, censusGroup),
    countByAdequacy(adequacies, representativePoints, AdequacyMode.ADEQUATE_1, censusGroup),
    countByAdequacy(adequacies, representativePoints, AdequacyMode.ADEQUATE_2, censusGroup),
    countByAdequacy(adequacies, representativePoints, AdequacyMode.INADEQUATE, censusGroup)
  ]
  return populationByAdequacy
}
