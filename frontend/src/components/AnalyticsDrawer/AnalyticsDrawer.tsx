import * as React from 'react'
import { withStore } from '../../services/store'
import { DownloadAnalysisLink } from '../DownloadAnalysisLink/DownloadAnalysisLink'
import { BackLink } from '../Link/Link'
import { CensusCategorySelector } from '../Selectors/CensusCategorySelector'
import { FormatSelector } from '../Selectors/FormatSelector'
import { ServiceAreaSelector } from '../Selectors/ServiceAreaSelector'
import './AnalyticsDrawer.css'
import { CensusAnalytics } from './CensusAnalytics'

/**
 * TODO: Show loading indicator while necessary data is being fetched.
 */
export let AnalyticsDrawer = withStore('selectedDataset', 'selectedCensusCategory', 'selectedCounties', 'selectedFormat')(({ store }) => {

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
      <div>{selectedDataset.dataSources.map(_ => <p key={_}>{_}</p>)}</div>
    </div>
    <div className='Selectors'>
      <div className='SelectorRow'>
        <body className='HeavyWeight Muted'>Service areas</body>
        <ServiceAreaSelector
          className='Menu'
          onChange={store.set('selectedCounties')}
          value={store.get('selectedCounties')}
        />
      </div>
      <div className='SelectorRow'>
        <body className='HeavyWeight Muted'>Demographic</body>
        <CensusCategorySelector
          className='Menu'
          onChange={store.set('selectedCensusCategory')}
          value={store.get('selectedCensusCategory')}
        />
      </div>
      <div className='SelectorRow'>
        <body className='HeavyWeight Muted'>Format</body>
        <FormatSelector
          className='Menu'
          onChange={store.set('selectedFormat')}
          value={store.get('selectedFormat')}
        />
      </div>

    </div>
    <div className='CensusAnalytics'>
      <CensusAnalytics />
    </div>
    <div className='DownloadLink'>
      <DownloadAnalysisLink />
    </div>
  </div>
})
