import * as React from 'react'
import { withStore } from '../../../../services/store'
import { ServiceAreaSelector } from '../../../ServiceAreaSelector/ServiceAreaSelector';
import { AdequacyDonut } from './AdequacyDonut'

export let ServiceAreaAnalytics = withStore('selectedServiceArea')(({ store }) =>
  <div className='ServiceAreaAnalytics'>
    {<ServiceAreaSelector
      onChange={store.set('selectedServiceArea')}
      value={store.get('selectedServiceArea')}
    />}
    {<AdequacyDonut serviceAreas={[store.get('selectedServiceArea')!]} />}
  </div>
)
