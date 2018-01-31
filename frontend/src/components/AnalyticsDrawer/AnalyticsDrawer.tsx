import * as React from 'react'
import { withStore } from '../../services/store'
import { DownloadAnalysisLink } from '../DownloadAnalysisLink/DownloadAnalysisLink'
import { BackLink } from '../Link/Link'
import { ServiceAreaSelector } from '../ServiceAreaSelector/ServiceAreaSelector'
import './AnalyticsDrawer.css'
import { ServiceAreaAnalytics } from './ServiceAreaAnalytics'

/**
 * TODO: Show loading indicator while necessary data is being fetched.
 */
export let AnalyticsDrawer = withStore('selectedDataset', 'selectedServiceArea')(({ store }) => {

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
      <strong className='MediumWeight Muted'>Service areas:</strong>
      <ServiceAreaSelector
        onChange={store.set('selectedServiceArea')}
        value={store.get('selectedServiceArea')}
      />
    </div>
    <div className='Analytics'>
      <ServiceAreaAnalytics />
    </div>
    <div className='DownloadLink'>
      <DownloadAnalysisLink />
    </div>
  </div>
})
