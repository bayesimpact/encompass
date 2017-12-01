import * as React from 'react'
import { withStore } from '../../services/store'
import { averageDistance, maxDistance, minDistance } from '../../utils/analytics'
import { adequaciesFromServiceArea } from '../../utils/data'
import { formatNumber } from '../../utils/formatters'
import { AdequacyDoughnut } from '../AdequacyDoughnut/AdequacyDoughnut'
import { StatsBox } from '../StatsBox/StatsBox'
import './ServiceAreaAnalytics.css'

export let ServiceAreaAnalytics = withStore(
  'adequacies',
  'selectedServiceArea'
)(({ store }) => {

  let selectedServiceArea = store.get('selectedServiceArea')!
  let adequacies = adequaciesFromServiceArea(selectedServiceArea, store)

  return <div className='ServiceAreaAnalytics'>
    <AdequacyDoughnut serviceAreas={[store.get('selectedServiceArea')!]} />
    <StatsBox withBorders withHorizontalLines>
      <tr>
        <th />
        <th>Avg</th>
        <th>Min</th>
        <th>Max</th>
      </tr>
      <tr>
        <th>Distance (mi)</th>
        <td>{formatNumber(averageDistance(adequacies))}</td>
        <td>{formatNumber(minDistance(adequacies))}</td>
        <td>{formatNumber(maxDistance(adequacies))}</td>
      </tr>
      <tr>
        <th>Time (min)</th>
        <td>-</td>
        <td>-</td>
        <td>-</td>
      </tr>
    </StatsBox>
  </div>
})
