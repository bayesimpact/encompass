import { Drawer } from 'material-ui'
import * as React from 'react'
import { withStore } from '../../../../services/store'
import { ServiceAreaAnalytics } from './ServiceAreaAnalytics'
import { TotalAnalytics } from './TotalAnalytics'
import { ViewPicker } from './ViewPicker'

/**
 * TODO: Show loading indicator while CSV is uploading + parsing
 * or necessary data is being fetched.
 */
export let AnalyticsDrawer = withStore('representativePoints', 'selectedServiceArea')(({ store }) =>
  <Drawer className='LeftDrawer' open={true}>
    <h2>Analytics</h2>
    <ViewPicker
      disabled={!store.get('serviceAreas').length}
      onChange={_ => store.set('selectedServiceArea')(
        _ === 'serviceArea'
          ? store.get('serviceAreas')[0] // Select 0th service area by default
          : null
      )}
      value={store.get('selectedServiceArea') ? 'serviceArea' : 'total'}
    />
    {store.get('serviceAreas').length > 0 && (
      store.get('selectedServiceArea') ? <ServiceAreaAnalytics /> : <TotalAnalytics />
    )}
  </Drawer>
)
