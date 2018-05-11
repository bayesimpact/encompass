import FlatButton from 'material-ui/FlatButton'
import DownloadIcon from 'material-ui/svg-icons/file/file-download'
import * as React from 'react'
import * as ReactGA from 'react-ga'
import { CONFIG } from '../../config/config'
import { Store, withStore } from '../../services/store'
import { download } from '../../utils/download'
import { buildCsvFromData, getCsvName, getStaticCsvUrl } from './BuildCSV'

import './DownloadAnalysisLink.css'

const useStaticCsvs: boolean = CONFIG.staticAssets.csv.useStaticCsvs

export let DownloadAnalysisLink = withStore(({ store }) =>
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

  const csvName = getCsvName(selectedDataset, method)
  if (useStaticCsvs) { // If in production, use the cached static CSVs.
    const staticCsvUrl = getStaticCsvUrl(csvName)
    window.open(staticCsvUrl)
  } else { // Otherwise, generate the CSV.
    if (store.get('serviceAreas').length > 100 && !confirm('Preparing the file for this state may take a couple of minutes. \n\nPress OK to continue.')) {
      return
    }
    let csv = buildCsvFromData(
      method,
      store.get('serviceAreas'),
      store.get('adequacies'),
      store.get('representativePoints')
    )
    download(csv, 'text/csv', csvName)
  }
}
