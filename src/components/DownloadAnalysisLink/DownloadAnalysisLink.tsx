import { FlatButton } from 'material-ui'
import DownloadIcon from 'material-ui/svg-icons/file/file-download'
import * as React from 'react'
import { Store, withStore } from '../../services/store'
import { averageDistance, averageTime, maxDistance, maxTime, minDistance, minTime } from '../../utils/analytics'
import { generateCSV } from '../../utils/csv'
import { adequaciesFromServiceArea, representativePointsFromServiceAreas, summaryStatistics } from '../../utils/data'
import { download } from '../../utils/download'
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

function onClick(store: Store) {
  return () => {
    let headers = [
      'CountyName',
      // 'City', // TODO
      'ZipCode',
      'SpecDesc',
      'BeneficiariesWithoutAccess',
      'PctWithoutAccess',
      'MinDist (mi)',
      'MinTime (min)',
      'AvgDist (mi)',
      'AvgTime (min)',
      'MaxDist (mi)',
      'MaxTime (min)'
    ]
    let selectedServiceArea = store.get('selectedServiceArea')
    let serviceAreas = selectedServiceArea
      ? [selectedServiceArea]
      : store.get('serviceAreas')
    let data = serviceAreas.map(_ => {
      let representativePoint = representativePointsFromServiceAreas([_], store).value()[0]
      let adequacies = adequaciesFromServiceArea(_, store)
      let { numInadequatePopulation, percentInadequatePopulation } = summaryStatistics([_], store)
      return [
        representativePoint.county,
        representativePoint.zip,
        store.get('providers')[0].specialty, // TODO: Is this safe to assume?
        numInadequatePopulation,
        percentInadequatePopulation,
        minDistance(adequacies),
        minTime(adequacies),
        averageDistance(adequacies),
        averageTime(adequacies),
        maxDistance(adequacies),
        maxTime(adequacies)
      ]
    })
    let csv = generateCSV(headers, data)
    download(csv, 'text/csv', `bayesimpact-analysis-${new Date().toISOString()}.csv`)
  }
}
