import { flattenDeep } from 'lodash'
import FlatButton from 'material-ui/FlatButton'
import DownloadIcon from 'material-ui/svg-icons/file/file-download'
import * as React from 'react'
import * as ReactGA from 'react-ga'
import { CENSUS_MAPPING } from '../../constants/census'
import { AdequacyMode, Method } from '../../constants/datatypes'
import { Store, withStore } from '../../services/store'
import { averageMeasure, maxMeasure, minMeasure } from '../../utils/analytics'
import { generateCSV } from '../../utils/csv'
import { adequaciesFromServiceArea, representativePointsFromServiceAreas, summaryStatisticsByServiceArea, summaryStatisticsByServiceAreaAndCensus } from '../../utils/data'
import { download } from '../../utils/download'
import { snakeCase } from '../../utils/string'
import { getLegend } from '../MapLegend/MapLegend'

import './DownloadAnalysisLink.css'

export let DownloadAnalysisLink = withStore()(({ store }) =>
  <FlatButton
    className='DownloadAnalysisLink Button -Primary'
    icon={<DownloadIcon />}
    label='Download'
    labelPosition='before'
    onClick={onClick(store)}
  />
)

DownloadAnalysisLink.displayName = 'DownloadAnalysisLink'

function onClick(store: Store) {
  let method = store.get('method')
  const selectedDataset = store.get('selectedDataset')
  let censusCategories = Object.keys(CENSUS_MAPPING).sort()
  return () => {
    ReactGA.event({
      category: 'Analysis',
      action: 'Downloaded analysis results',
      label: selectedDataset ? selectedDataset.name : 'Unknown Dataset'
    })
    let headers = [
      'county',
      'total_' + formatLegend(getLegend(method, AdequacyMode.ADEQUATE_0)),
      'total_' + formatLegend(getLegend(method, AdequacyMode.ADEQUATE_1)),
      'total_' + formatLegend(getLegend(method, AdequacyMode.ADEQUATE_2)),
      'total_' + formatLegend(getLegend(method, AdequacyMode.INADEQUATE)),
      'min_' + method,
      'avg_' + method,
      'max_' + method
    ]

    headers.push.apply(headers, getHeadersForCensusCategories(method, censusCategories))

    let serviceAreas = store.get('serviceAreas')
    if (serviceAreas.length > 100) {
      alert('There are many service areas in this state! Preparing the file may take a minute or two...')
    }
    let data = serviceAreas.map(_ => {
      let representativePoint = representativePointsFromServiceAreas([_], store).value()[0]
      let adequacies = adequaciesFromServiceArea([_], store)
      let populationByAnalytics = summaryStatisticsByServiceArea([_], store)
      let specialty = store.get('providers')[0].specialty // TODO: Is this safe to assume?
      if (specialty == null) {
        specialty = '-'
      }
      let dataRow = [
        representativePoint.county,
        populationByAnalytics[0],
        populationByAnalytics[1],
        populationByAnalytics[2],
        populationByAnalytics[3],
        minMeasure(adequacies),
        averageMeasure(adequacies),
        maxMeasure(adequacies)
      ]
      dataRow.push.apply(dataRow, getDataForCensusCategories([_], censusCategories, store))
      return dataRow
    })
    let csv = generateCSV(headers, data)
    // Sample filename: encompass-analysis-haversine-2018-03-06.csv
    download(csv, 'text/csv', `encompass-analysis-${method}-${new Date().toJSON().slice(0, 10)}.csv`)
  }
}

function getHeadersForCensusCategories(method: Method, censusCategories: string[]) {
  return flattenDeep(censusCategories.map(_ => CENSUS_MAPPING[_].map(
    group => [
      getLegend(method, AdequacyMode.ADEQUATE_0),
      getLegend(method, AdequacyMode.ADEQUATE_1),
      getLegend(method, AdequacyMode.ADEQUATE_2),
      getLegend(method, AdequacyMode.INADEQUATE)].map(
        legend => formatLegend([_, group, legend].join('_'))
      ))))
}

function getDataForCensusCategories(serviceAreas: string[] | null, censusCategories: string[], store: Store) {
  return flattenDeep(
    censusCategories.map(_ => {
      let summary = summaryStatisticsByServiceAreaAndCensus(serviceAreas!, _, store)
      return CENSUS_MAPPING[_].map(group => summary[group])
    })
  )
}

function formatLegend(string: string) {
  return snakeCase(string.replace('<', 'lt').replace('>', 'gt').replace('-', ' to '))
}
