import * as React from 'react'
import { withStore } from '../../../../services/store'
import { averageDistance, averageTime, maxDistance, maxTime, minDistance, minTime } from '../../../../utils/analytics'
import { adequaciesFromServiceArea } from '../../../../utils/data'
import { formatNumber } from '../../../../utils/formatters'
import { StatsBox } from '../../../StatsBox/StatsBox'
import { AdequacyDoughnut } from './AdequacyDoughnut'
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
        <td>{formatNumber(averageTime(adequacies))}</td>
        <td>{formatNumber(minTime(adequacies))}</td>
        <td>{formatNumber(maxTime(adequacies))}</td>
      </tr>
    </StatsBox>
  </div>
})
