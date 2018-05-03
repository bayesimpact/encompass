import FlatButton from 'material-ui/FlatButton'
import DownloadIcon from 'material-ui/svg-icons/file/file-download'
import * as React from 'react'
import * as ReactGA from 'react-ga'
import { CONFIG } from '../../config/config'

import { Store, withStore } from '../../services/store'
import { download } from '../../utils/download'
import { buildCsvFromData, getStaticCsvUrl } from './BuildCSV'

import './DownloadAnalysisLink.css'

const useStaticCsvs: boolean = CONFIG.staticAssets.csv.useStaticCsvs

export let DownloadAnalysisLink = withStore()(({ store }) =>
  <FlatButton
    className='DownloadAnalysisLink Button -Primary'
    icon={<DownloadIcon />}
    label='Download'
    labelPosition='before'
    onClick={() => onClick(store)}
  />
)

DownloadAnalysisLink.displayName = 'DownloadAnalysisLink'

function onClick(store: Store) {
  // Get which dataset/method to produce CSV for.
  const method = store.get('method')
  const selectedDataset = store.get('selectedDataset')

  // Send GA event.
  ReactGA.event({
    category: 'Analysis',
    action: 'Downloaded analysis results',
    label: selectedDataset ? selectedDataset.name : 'Unknown Dataset'
  })

  if (useStaticCsvs) { // If activated, use the cached static CSVs.
    const staticCsvUrl = getStaticCsvUrl(selectedDataset, method)
    window.open(staticCsvUrl)
  } else { // Otherwise, generate the CSV.
    let csv = buildCsvFromData(
      method,
      store.get('serviceAreas'),
      store.get('adequacies'),
      store.get('representativePoints')
    )
    // Sample filename: encompass-analysis-haversine-2018-03-06.csv
    download(csv, 'text/csv', `encompass-analysis-${method}-${new Date().toJSON().slice(0, 10)}.csv`)
  }
}
