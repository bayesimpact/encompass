import CircularProgress from 'material-ui/CircularProgress';
import { Drawer } from 'material-ui'
import MarkerIcon from 'mui-icons/cmdi/map-marker'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { store, withStore } from '../../services/store'
import { InfoBox } from '../InfoBox/InfoBox'
import { ServiceAreaSelector } from '../ServiceAreaSelector/ServiceAreaSelector'
import { Refresh } from '../Refresh/Refresh'
import './AnalyticsDrawer.css'
import { ServiceAreaAnalytics } from './ServiceAreaAnalytics'
import { TotalAnalytics } from './TotalAnalytics'

function pickAnalytics() {
  if (store.get('serviceAreas').length == 0) {
    return <InfoBox large>
        Please choose a service area in the <Link to='/service-areas'><MarkerIcon /> Service Areas drawer</Link>
      </InfoBox>
  }
  if (store.get('adequacyComputationInProgress')) {
    return <div style={{marginTop: 30}}>
      <div style={{marginLeft: 'auto', marginRight: 'auto', display: 'block', width: 140}}>
        <div style={{marginBottom: 15, marginTop: 15}}>Computing adequacy...</div>
        <CircularProgress size={120} thickness={7} style={{display: 'block'}} />
      </div>
    </div>
  } 
  if (store.get('selectedServiceArea')) {
    return <div>
      {store.get('adequaciesComputed') ? <ServiceAreaAnalytics /> : <Refresh />}
    </div>
  }
  return <div>
    {store.get('adequaciesComputed') ? <TotalAnalytics /> : <Refresh />}
  </div>
}

/**
 * TODO: Show loading indicator while CSV is uploading + parsing
 * or necessary data is being fetched.
 */
export let AnalyticsDrawer = withStore(
  'representativePoints', 'selectedServiceArea', 'adequaciesComputed', 'adequacyComputationInProgress')(() =>
  <Drawer className='LeftDrawer' open={true}>
    <h2>Analytics</h2>
    <ServiceAreaSelector
      onChange={store.set('selectedServiceArea')}
      value={store.get('selectedServiceArea')}
    />
    {pickAnalytics()}
  </Drawer>
)
