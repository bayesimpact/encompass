import { Drawer } from 'material-ui'
import ProvidersIcon from 'mui-icons/cmdi/account-multiple'
import MarkerIcon from 'mui-icons/cmdi/map-marker'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { withStore } from '../../services/store'
import { DownloadAnalysisLink } from '../DownloadAnalysisLink/DownloadAnalysisLink'
import { InfoBox } from '../InfoBox/InfoBox'
import { ServiceAreaSelector } from '../ServiceAreaSelector/ServiceAreaSelector'
import './AnalyticsDrawer.css'
import { ServiceAreaAnalytics } from './ServiceAreaAnalytics'
import { TotalAnalytics } from './TotalAnalytics'

let Analytics = withStore(
  'providers',
  'selectedServiceArea',
  'serviceAreas'
)(({ store }) => {

  if (store.get('serviceAreas').length === 0) {
    return <InfoBox large>
      Please choose a service area in the <Link to='/service-areas'><MarkerIcon /> Service Areas drawer</Link>
    </InfoBox>
  }

  if (store.get('providers').length === 0) {
    return <InfoBox large>
      Please upload providers in the <Link to='/providers'><ProvidersIcon /> Providers drawer</Link>
    </InfoBox>
  }

  if (store.get('selectedServiceArea')) {
    return <div>
      <ServiceAreaAnalytics />
      <DownloadAnalysisLink />
    </div>
  }

  return <div>
    <TotalAnalytics />
    <DownloadAnalysisLink />
  </div>

})

/**
 * TODO: Show loading indicator while CSV is uploading + parsing
 * or necessary data is being fetched.
 */
export let AnalyticsDrawer = withStore('representativePoints', 'selectedServiceArea')(({ store }) =>
  <Drawer className='LeftDrawer' open={true}>
    <h2>Analytics</h2>
    <ServiceAreaSelector
      onChange={store.set('selectedServiceArea')}
      value={store.get('selectedServiceArea')}
    />
    <Analytics />
  </Drawer>
)
