import * as React from 'react'
import { withStore } from '../../services/store'
import { DownloadAnalysisLink } from '../DownloadAnalysisLink/DownloadAnalysisLink'
import { Link } from '../Link/Link'
import { ServiceAreaSelector } from '../ServiceAreaSelector/ServiceAreaSelector'
import './AnalyticsDrawer.css'

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
    <strong className='MediumWeight Muted'>Service areas:</strong>
    <ServiceAreaSelector
      onChange={store.set('selectedServiceArea')}
      value={store.get('selectedServiceArea')}
    />
    <DownloadAnalysisLink />
  </div>
})

let BackLink = withStore()(({ store }) =>
  <Link
    className='Muted Uppercase'
    onClick={() => store.set('selectedDataset')(null)}
    to='/datasets'
  >⟵ Back to datasets</Link>
)
