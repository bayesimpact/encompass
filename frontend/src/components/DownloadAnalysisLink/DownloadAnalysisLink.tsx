import { FlatButton } from 'material-ui'
import DownloadIcon from 'material-ui/svg-icons/file/file-download'
import * as React from 'react'
import { Store, withStore } from '../../services/store'
import { averageDistance, maxDistance, minDistance } from '../../utils/analytics'
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
DownloadAnalysisLink.displayName = 'DownloadAnalysisLink'

function onClick(store: Store) {
  return () => {
    let headers = [
      'CountyName',
      'ZipCode',
      'SpecDesc',
      'BeneficiariesWithAccess',
      'BeneficiariesWithoutAccess',
      'PctWithAccess',
      'PctWithoutAccess',
      'MinDist (mi)',
      'AvgDist (mi)',
      'MaxDist (mi)',
      'MinTime (min)',
      'AvgTime (min)',
      'MaxTime (min)'
    ]
    let selectedServiceArea = store.get('selectedServiceArea')
    let serviceAreas = selectedServiceArea
      ? [selectedServiceArea]
      : store.get('serviceAreas')
    let data = serviceAreas.map(_ => {
      let representativePoint = representativePointsFromServiceAreas([_], store).value()[0]
      let adequacies = adequaciesFromServiceArea([_], store)
      let {
        numAdequatePopulation,
        numInadequatePopulation,
        percentAdequatePopulation,
        percentInadequatePopulation
      } = summaryStatistics([_], store)
      let specialty = store.get('providers')[0].specialty // TODO: Is this safe to assume?
      if (specialty == null) {
        specialty = '-'
      }
      return [
        representativePoint.county,
        representativePoint.zip,
        specialty,
        numAdequatePopulation,
        numInadequatePopulation,
        percentAdequatePopulation,
        percentInadequatePopulation,
        minDistance(adequacies),
        averageDistance(adequacies),
        maxDistance(adequacies),
        '-',
        '-',
        '-'
      ]
    })
    let csv = generateCSV(headers, data)
    download(csv, 'text/csv', `bayesimpact-analysis-${new Date().toISOString()}.csv`)
  }
}
