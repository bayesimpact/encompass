import * as React from 'react'
import { withStore } from '../../services/store'
import { DownloadAnalysisLink } from '../DownloadAnalysisLink/DownloadAnalysisLink'
import { BackLink } from '../Link/Link'
import { SelectorBlock } from '../Selectors/SelectorBlock'
import './AnalyticsDrawer.css'
import { CensusAnalytics } from './CensusAnalytics'

/**
 * TODO: Show loading indicator while necessary data is being fetched.
 */
export let AnalyticsDrawer = withStore(
  'selectedDataset', 'selectedCensusCategory', 'selectedCounties',
  'selectedCountyType', 'selectedFormat', 'selectedServiceAreas', 'selectedFilterMethod')(({ store }) => {

    let selectedDataset = store.get('selectedDataset')

    if (!selectedDataset) {
      return <div className='AnalyticsDrawer'>
        <BackLink />
        <p>Error - Please reload the page</p>
      </div>
    }

    return <div className='AnalyticsDrawer'>
      <BackLink />
      <h2 className='Secondary'>{selectedDataset.name}</h2>
      <div className='DataSources'>
        <body className='HeavyWeight Muted'>Data sources</body>
        <div>{selectedDataset.dataSources}</div>
      </div>
      <div className='Selectors'>
        <SelectorBlock />
        <div className='CensusAnalytics'>
          <CensusAnalytics />
        </div>
        <div className='DownloadLink'>
          <DownloadAnalysisLink />
        </div>
      </div>
    </div>
  })
