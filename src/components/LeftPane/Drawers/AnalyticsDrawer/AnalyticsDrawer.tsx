import { Drawer } from 'material-ui'
import * as React from 'react'
import { withStore } from '../../../../services/store'
import { ALL_SERVICE_AREAS, ServiceAreaSelector } from '../../../ServiceAreaSelector/ServiceAreaSelector'
import './AnalyticsDrawer.css'
import { ServiceAreaAnalytics } from './ServiceAreaAnalytics'
import { TotalAnalytics } from './TotalAnalytics'

/**
 * TODO: Show loading indicator while CSV is uploading + parsing
 * or necessary data is being fetched.
 */
export let AnalyticsDrawer = withStore('representativePoints', 'selectedServiceArea')(({ store }) =>
  <Drawer className='LeftDrawer' open={true}>
    <h2>Analytics</h2>
    <ServiceAreaSelector
      onChange={_ => store.set('selectedServiceArea')(_ === ALL_SERVICE_AREAS ? null : _)}
      value={store.get('selectedServiceArea') || ALL_SERVICE_AREAS}
    />
    {store.get('serviceAreas').length > 0 && (
      store.get('selectedServiceArea') ? <ServiceAreaAnalytics /> : <TotalAnalytics />
    )}
  </Drawer>
)
