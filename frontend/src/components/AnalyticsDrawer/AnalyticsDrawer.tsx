import * as React from 'react'
import { withStore } from '../../services/store'
import { DownloadAnalysisLink } from '../DownloadAnalysisLink/DownloadAnalysisLink'
import { BackLink } from '../Link/Link'
import { CensusCategorySelector } from '../Selectors/CensusCategorySelector'
import { FormatSelector } from '../Selectors/FormatSelector'
import { ServiceAreaSelector } from '../Selectors/ServiceAreaSelector'
import './AnalyticsDrawer.css'
import { CensusAnalytics } from './CensusAnalytics'
import { ServiceAreaAnalytics } from './ServiceAreaAnalytics'

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
      <strong className='MediumWeight Muted'>Data sources:</strong>
      <div>{selectedDataset.dataSources.map(_ => <p key={_}>{_}</p>)}</div>
    </div>
    <div className='ServiceAreas'>
      <strong className='MediumWeight Muted'>Service areas</strong>
      <ServiceAreaSelector
        onChange={store.set('selectedCounties')}
        value={store.get('selectedCounties')}
      />
    </div>
    <div className='Analytics'>
      <ServiceAreaAnalytics />
    </div>
    <div className='CensusAnalytics'>
      <strong className='MediumWeight Muted'>Demographic</strong>
      <CensusCategorySelector
        onChange={store.set('selectedCensusCategory')}
        value={store.get('selectedCensusCategory')}
      />
    </div>
    <div>
      <strong className='MediumWeight Muted'>Format</strong>
      <FormatSelector
        onChange={store.set('selectedFormat')}
        value={store.get('selectedFormat')}
      />
    </div>
    <div className='CensusAnalytics'>
      <CensusAnalytics />
    </div>
    <div className='DownloadLink'>
      <DownloadAnalysisLink />
    </div>
  </div>
})
