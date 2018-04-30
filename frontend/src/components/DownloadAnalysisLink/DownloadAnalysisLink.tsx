import { kebabCase } from 'lodash'
import FlatButton from 'material-ui/FlatButton'
import DownloadIcon from 'material-ui/svg-icons/file/file-download'
import * as React from 'react'
import * as ReactGA from 'react-ga'
import { CONFIG } from '../../config/config'
import { Dataset, Method } from '../../constants/datatypes'
import { Store, withStore } from '../../services/store'
import { buildCsvFromData } from './BuildAnalysis'

import './DownloadAnalysisLink.css'

const useStaticCsvs: boolean = CONFIG.staticAssets.csv.useStaticCsvs
const staticCsvRootUrl: string = CONFIG.staticAssets.rootUrl
const staticCsvPath: string = CONFIG.staticAssets.csv.path

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
    if (store.get('serviceAreas').length > 100 && !confirm('Preparing the file for this state may take a couple of minutes. \n\nPress OK to continue.')) {
      return
    }
    buildCsvFromData(
      method,
      store.get('serviceAreas'),
      store.get('adequacies'),
      store.get('representativePoints')
    )
  }
}

/**
 * Build URL for static CSV for selected dataset and adequacy measure.
 */
function getStaticCsvUrl(selectedDataset: Dataset | null, method: Method) {
  if (!selectedDataset) {
    return
  }
  const datasetString = kebabCase(selectedDataset.name)
  const methodString = kebabCase(method.toString())
  return `${staticCsvRootUrl}${staticCsvPath}${datasetString}-${methodString}.csv`
}
