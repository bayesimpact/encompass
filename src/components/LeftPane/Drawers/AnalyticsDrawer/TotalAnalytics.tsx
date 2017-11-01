import * as React from 'react'
import { withStore } from '../../../../services/store'
import { AdequacyDonut } from './AdequacyDonut'

export let TotalAnalytics = withStore()(({ store }) =>
  <div className='TotalAnalytics'>
    {<AdequacyDonut serviceAreas={store.get('serviceAreas')} />}
  </div>
)
