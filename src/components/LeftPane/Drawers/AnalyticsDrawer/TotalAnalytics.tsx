import * as React from 'react'
import { withStore } from '../../../../services/store'
import { population } from '../../../../utils/analytics'
import { StatsBox } from '../../../StatsBox/StatsBox'
import { AdequacyDonut } from './AdequacyDonut'
import './TotalAnalytics.css'

export let TotalAnalytics = withStore()(({ store }) =>
  <div className='TotalAnalytics'>
    <StatsBox className='HighLevelStats' withBorders>
      <tr>
        <th>Service Areas</th>
        <th>Population</th>
        <th>Providers</th>
      </tr>
      <tr>
        <td>{store.get('serviceAreas').length}</td>
        <td>{population(store.get('serviceAreas'), store.get('representativePoints')).toLocaleString()}</td>
        <td>{store.get('providers').length.toLocaleString()}</td>
      </tr>
    </StatsBox>
    <AdequacyDonut serviceAreas={store.get('serviceAreas')} />
  </div>
)
