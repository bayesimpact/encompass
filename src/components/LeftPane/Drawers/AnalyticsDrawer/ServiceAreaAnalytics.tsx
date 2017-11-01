import * as React from 'react'
import { withStore } from '../../../../services/store'
import { StatsBox } from '../../../StatsBox/StatsBox'
import { AdequacyDoughnut } from './AdequacyDoughnut'
import './ServiceAreaAnalytics.css'

export let ServiceAreaAnalytics = withStore('selectedServiceArea')(({ store }) =>
  <div className='ServiceAreaAnalytics'>
    <AdequacyDoughnut serviceAreas={[store.get('selectedServiceArea')!]} />
  </div>
)
