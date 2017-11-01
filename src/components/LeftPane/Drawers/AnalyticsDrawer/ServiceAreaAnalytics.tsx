import * as React from 'react'
import { withStore } from '../../../../services/store'
import { AdequacyDonut } from './AdequacyDonut'

export let ServiceAreaAnalytics = withStore('selectedServiceArea')(({ store }) =>
  <div className='ServiceAreaAnalytics'>
    {<AdequacyDonut serviceAreas={[store.get('selectedServiceArea')!]} />}
  </div>
)
