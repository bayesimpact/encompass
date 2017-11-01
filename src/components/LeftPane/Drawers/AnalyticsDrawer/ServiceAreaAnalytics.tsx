import * as React from 'react'
import { withStore } from '../../../../services/store'
import { StatsBox } from '../../../StatsBox/StatsBox'
import { AdequacyDonut } from './AdequacyDonut'
import './ServiceAreaAnalytics.css'

export let ServiceAreaAnalytics = withStore('selectedServiceArea')(({ store }) =>
  <div className='ServiceAreaAnalytics'>
    <AdequacyDonut serviceAreas={[store.get('selectedServiceArea')!]} />
  </div>
)
