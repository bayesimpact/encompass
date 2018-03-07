import FlatButton from 'material-ui/FlatButton'
import DownloadIcon from 'material-ui/svg-icons/file/file-download'
import * as React from 'react'
import * as ReactGA from 'react-ga'
import { AdequacyMode } from '../../constants/datatypes'
import { Store, withStore } from '../../services/store'
import { averageMeasure, maxMeasure, minMeasure } from '../../utils/analytics'
import { generateCSV } from '../../utils/csv'
import { adequaciesFromServiceArea, representativePointsFromServiceAreas, summaryStatisticsByServiceArea } from '../../utils/data'
import { download } from '../../utils/download'
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
  return () => {
    ReactGA.event({
      category: 'Analysis',
      action: 'Download analysis results'
    })
    let headers = [
      'CountyName',
      'ZipCode',
      'SpecDesc',
      getLegend(method, AdequacyMode.ADEQUATE_15),
      getLegend(method, AdequacyMode.ADEQUATE_30),
      getLegend(method, AdequacyMode.ADEQUATE_60),
      getLegend(method, AdequacyMode.INADEQUATE),
      'Min_' + method,
      'Avg_' + method,
      'Max_' + method
    ]
    let selectedServiceAreas = store.get('selectedServiceAreas')
    let serviceAreas = selectedServiceAreas ? selectedServiceAreas : store.get('serviceAreas')
    let data = serviceAreas.map(_ => {
      let representativePoint = representativePointsFromServiceAreas([_], store).value()[0]
      let adequacies = adequaciesFromServiceArea([_], store)
      let populationByAnalytics = summaryStatisticsByServiceArea([_], store)
      let specialty = store.get('providers')[0].specialty // TODO: Is this safe to assume?
      if (specialty == null) {
        specialty = '-'
      }
      return [
        representativePoint.county,
        representativePoint.zip,
        specialty,
        populationByAnalytics[0],
        populationByAnalytics[1],
        populationByAnalytics[2],
        populationByAnalytics[3],
        minMeasure(adequacies),
        averageMeasure(adequacies),
        maxMeasure(adequacies)
      ]
    })
    let csv = generateCSV(headers, data)
    // Sample filename: encompass-analysis-haversine-2018-03-06.csv
    download(csv, 'text/csv', `encompass-analysis-${method}-${new Date().toJSON().slice(0, 10)}.csv`)
  }
}
