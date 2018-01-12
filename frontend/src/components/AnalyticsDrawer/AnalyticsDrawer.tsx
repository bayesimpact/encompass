import * as React from 'react'
import { withStore } from '../../services/store'
import { DownloadAnalysisLink } from '../DownloadAnalysisLink/DownloadAnalysisLink'
import { ServiceAreaSelector } from '../ServiceAreaSelector/ServiceAreaSelector'
import './AnalyticsDrawer.css'
import { ServiceAreaAnalytics } from './ServiceAreaAnalytics'

/**
 * TODO: Show loading indicator while necessary data is being fetched.
 */
export let AnalyticsDrawer = withStore('selectedServiceArea')(({ store }) =>
  <div>
    <h2>Analytics</h2>
    <ServiceAreaSelector
      onChange={store.set('selectedServiceArea')}
      value={store.get('selectedServiceArea')}
    />
    <ServiceAreaAnalytics />
    <DownloadAnalysisLink />
  </div>
)
