import { kebabCase } from 'lodash'
import { flattenDeep } from 'lodash'
import { CONFIG } from '../../config/config'
import { CENSUS_MAPPING } from '../../constants/census'
import { Adequacies, AdequacyMode, Dataset, Method, RepresentativePoint } from '../../constants/datatypes'
import { getLegend } from '../../utils/adequacy'
import { averageMeasure, maxMeasure, minMeasure } from '../../utils/analytics'
import { generateCSV } from '../../utils/csv'
import { adequaciesFromServiceArea, representativePointsFromServiceAreas, summaryStatisticsByServiceArea } from '../../utils/data'
import { parseSerializedServiceArea, safeDatasetHint } from '../../utils/formatters'
import { precisionRound } from '../../utils/numbers'
import { snakeCase } from '../../utils/string'

const staticCsvRootUrl: string = CONFIG.staticAssets.rootUrl
const staticCsvPath: string = CONFIG.staticAssets.csv.path
const defaultPrecision: number = 2 // Default decimal precision for CSV.
/**
 * Build an analysis CSV for download from the census data.
 */
export function buildCsvFromData(method: Method, serviceAreas: string[], adequacies: Adequacies, representativePoints: RepresentativePoint[]) {
  let censusCategories = Object.keys(CENSUS_MAPPING).sort()
  let headers = [
    'county',
    'total_' + formatCSVColumnTitle(getLegend(method, AdequacyMode.ADEQUATE_0)),
    'total_' + formatCSVColumnTitle(getLegend(method, AdequacyMode.ADEQUATE_1)),
    'total_' + formatCSVColumnTitle(getLegend(method, AdequacyMode.ADEQUATE_2)),
    'total_' + formatCSVColumnTitle(getLegend(method, AdequacyMode.INADEQUATE)),
    'min_' + method,
    'avg_' + method,
    'max_' + method
  ]

  headers.push.apply(headers, getHeadersForCensusCategories(method, censusCategories))

  let data = serviceAreas.map(_ => {
    let adequaciesForServiceArea = adequaciesFromServiceArea([_], adequacies, representativePoints)
    let representativePointsForServiceArea = representativePointsFromServiceAreas([_], representativePoints)
    let populationByAnalytics = summaryStatisticsByServiceArea([_], adequacies, representativePoints)
    let dataRow = [
      parseSerializedServiceArea(_).county,
      populationByAnalytics[0],
      populationByAnalytics[1],
      populationByAnalytics[2],
      populationByAnalytics[3],
      minMeasure(adequaciesForServiceArea),
      averageMeasure(adequaciesForServiceArea),
      maxMeasure(adequaciesForServiceArea)
    ]
    // getDataForCensusCategories assumes that demographics are given at the service area level.
    // Checkout getDataForCensusCategoriesSlow if you need mnore accurate calculations.
    dataRow.push.apply(dataRow, getDataForCensusCategories(representativePointsForServiceArea.value()[0].demographics!, populationByAnalytics, censusCategories))
    return dataRow
  })
  return generateCSV(headers, data)
}

function getHeadersForCensusCategories(method: Method, censusCategories: string[]) {
  return flattenDeep(censusCategories.map(_ => CENSUS_MAPPING[_].map(
    group => [
      getLegend(method, AdequacyMode.ADEQUATE_0),
      getLegend(method, AdequacyMode.ADEQUATE_1),
      getLegend(method, AdequacyMode.ADEQUATE_2),
      getLegend(method, AdequacyMode.INADEQUATE)].map(
        legend => formatCSVColumnTitle([_, group, legend].join('_'))
      ))))
}

/**
 * We are currently using Census information at the service area level and implemented a faster version of getDataForCensusCategories
 * below. getDataForCensusCategoriesSlow provides an implementation that works at the representative point level.
 * function getDataForCensusCategoriesSlow(serviceAreas: string[] | null, censusCategories: string[], store: Store) {
 *   return flattenDeep(
 *     censusCategories.map(_ => {
 *       let summary = summaryStatisticsByServiceAreaAndCensus(serviceAreas!, _, store)
 *       return CENSUS_MAPPING[_].map(group => summary[group])
 *     })
 *   )
 * }
 */

function getDataForCensusCategories(demographics: any, populationByAnalytics: number[], censusCategories: string[]) {
  return flattenDeep(
    censusCategories.map(_ => {
      return CENSUS_MAPPING[_].map(group => {
        return (populationByAnalytics.map(category => precisionRound(category * 0.01 * demographics[_][group] || 0, defaultPrecision)))
      })
    })
  )
}

function formatCSVColumnTitle(string: string) {
  return snakeCase(string.replace('<', 'lt').replace('>', 'gt').replace('-', ' to ').replace('+', ' plus ').replace('Years', 'yrs'))
}

/**
 * Build URL for static CSV for selected dataset and adequacy measure.
 */
export function getCsvName(selectedDataset: Dataset | null, method: Method) {
  if (!selectedDataset) {
    throw Error('No dataset selected.')
  }
  const datasetString = kebabCase(safeDatasetHint(selectedDataset))
  const methodString = kebabCase(method.toString())
  return `${datasetString}-${methodString}.csv`
}

export function getStaticCsvUrl(csvName: string) {
  return `${staticCsvRootUrl}${staticCsvPath}${csvName}`
}
